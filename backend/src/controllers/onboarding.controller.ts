import mongoose from "mongoose";
import type { RequestHandler } from "express";
import { ApiError } from "../utils/api-error";
import { Organization } from "../models/organization.model";
import { Project } from "../models/project.model";
import { User } from "../models/user.model";
import {
  getNextOnboardingStep,
  parseOnboardingDraft,
} from "../middleware/validate-onboarding";

function getUserId(request: Parameters<RequestHandler>[0]): string {
  if (!request.authUser) {
    throw new ApiError(401, "Authentication is required");
  }
  return request.authUser.userId;
}

function toOnboardingResponse(organization: InstanceType<typeof Organization>) {
  return {
    status: organization.onboardingStatus,
    currentStep: organization.currentStep,
    company: organization.company ?? null,
    contact: organization.contact ?? null,
    firstProject: organization.firstProject ?? null,
  };
}

export const getOnboarding: RequestHandler = async (request, response) => {
  const userId = getUserId(request);
  const organization = await Organization.findOne({ ownerUserId: userId }).lean();
  response.status(200).json({
    onboarding: organization
      ? {
          status: organization.onboardingStatus,
          currentStep: organization.currentStep,
          company: organization.company ?? null,
          contact: organization.contact ?? null,
          firstProject: organization.firstProject ?? null,
        }
      : null,
  });
};

export const saveOnboardingDraft: RequestHandler = async (request, response) => {
  const userId = getUserId(request);
  const input = parseOnboardingDraft(request.body);
  const session = await mongoose.startSession();

  try {
    let updatedOrganization: InstanceType<typeof Organization> | null = null;
    await session.withTransaction(async () => {
      const currentOrganization = await Organization.findOne({ ownerUserId: userId })
        .session(session);
      if (currentOrganization?.onboardingStatus === "COMPLETED") {
        throw new ApiError(409, "Onboarding has already been completed");
      }

      if (input.step === "contact" && !currentOrganization?.company) {
        throw new ApiError(409, "Complete company information before adding a contact");
      }
      if (input.step === "firstProject" && !currentOrganization?.contact) {
        throw new ApiError(409, "Complete the company and contact steps before adding a project");
      }

      const field = input.step === "firstProject" ? "firstProject" : input.step;
      const savedOrganization = await Organization.findOneAndUpdate(
        { ownerUserId: userId },
        {
          $set: {
            [field]: input.data,
            currentStep: getNextOnboardingStep(input.step),
            onboardingStatus: "IN_PROGRESS",
          },
          $setOnInsert: { ownerUserId: userId },
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
          session,
        },
      );
      if (!savedOrganization) {
        throw new Error("Onboarding draft could not be saved");
      }
      updatedOrganization = savedOrganization;
      const userUpdate = await User.updateOne(
        { _id: userId, role: "ADMIN" },
        {
          $set: {
            onboardingStatus: "IN_PROGRESS",
            organizationId: savedOrganization._id,
          },
        },
        { session },
      );
      if (userUpdate.matchedCount !== 1) {
        throw new ApiError(401, "The authenticated account is no longer available");
      }
    });

    if (!updatedOrganization) {
      throw new Error("Onboarding draft transaction completed without an organization");
    }

    response.status(200).json({ onboarding: toOnboardingResponse(updatedOrganization) });
  } finally {
    await session.endSession();
  }
};

export const completeOnboarding: RequestHandler = async (request, response) => {
  if (
    request.body !== undefined &&
    (typeof request.body !== "object" ||
      request.body === null ||
      Array.isArray(request.body) ||
      Object.keys(request.body).length > 0)
  ) {
    throw new ApiError(400, "Onboarding completion does not accept a request body");
  }
  const userId = getUserId(request);
  const session = await mongoose.startSession();
  let result:
    | {
        created: boolean;
        organizationId: string;
        project: { id: string; name: string };
      }
    | undefined;

  try {
    await session.withTransaction(async () => {
      const user = await User.findOne({ _id: userId, role: "ADMIN" }).session(session);
      if (!user) {
        throw new ApiError(401, "The authenticated account is no longer available");
      }
      const organization = await Organization.findOne({ ownerUserId: userId }).session(session);
      if (!organization) {
        throw new ApiError(400, "Complete all onboarding steps before finishing setup");
      }

      if (organization.onboardingStatus === "COMPLETED") {
        if (!organization.initialProjectId) {
          throw new Error("Completed onboarding is missing its initial project reference");
        }
        const existingProject = await Project.findById(organization.initialProjectId).session(session);
        if (!existingProject) {
          throw new Error("Completed onboarding is missing its initial project");
        }
        result = {
          created: false,
          organizationId: organization.id,
          project: { id: existingProject.id, name: existingProject.name },
        };
        return;
      }

      const companyInput = parseOnboardingDraft({
        step: "company",
        data: organization.company,
      });
      if (companyInput.step !== "company") {
        throw new Error("Company onboarding validation returned an invalid step");
      }
      const contactInput = parseOnboardingDraft({
        step: "contact",
        data: organization.contact,
      });
      if (contactInput.step !== "contact") {
        throw new Error("Contact onboarding validation returned an invalid step");
      }
      const projectInput = parseOnboardingDraft({
        step: "firstProject",
        data: organization.firstProject,
      });
      if (projectInput.step !== "firstProject") {
        throw new Error("Project onboarding validation returned an invalid step");
      }
      const company = companyInput.data;
      const contact = contactInput.data;
      const firstProject = projectInput.data;

      const [project] = await Project.create(
        [{
          organizationId: organization._id,
          name: firstProject.name,
          siteAddress: firstProject.siteAddress,
          location: firstProject.location,
          startDate: new Date(`${firstProject.startDate}T00:00:00.000Z`),
          endDate: new Date(`${firstProject.endDate}T00:00:00.000Z`),
          createdBy: user._id,
        }],
        { session },
      );
      organization.company = company;
      organization.contact = contact;
      organization.firstProject = firstProject;
      organization.currentStep = "review";
      organization.onboardingStatus = "COMPLETED";
      organization.initialProjectId = project._id;
      await organization.save({ session });

      user.onboardingStatus = "COMPLETED";
      user.organizationId = organization._id;
      await user.save({ session });

      result = {
        created: true,
        organizationId: organization.id,
        project: { id: project.id, name: project.name },
      };
    });
  } finally {
    await session.endSession();
  }

  if (!result) {
    throw new Error("Onboarding completion transaction returned no result");
  }

  response.status(result.created ? 201 : 200).json({
    onboarding: { status: "COMPLETED" },
    organization: { id: result.organizationId },
    project: result.project,
  });
};
