import { ApiError } from "../utils/api-error";
import type {
  OrganizationCompanyDraft,
  OrganizationContactDraft,
  OrganizationProjectDraft,
  OnboardingStep,
} from "../models/organization.model";

export type OnboardingDraftInput =
  | { step: "company"; data: OrganizationCompanyDraft }
  | { step: "contact"; data: OrganizationContactDraft }
  | { step: "firstProject"; data: OrganizationProjectDraft };

function getObjectBody(value: unknown): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new ApiError(400, "Request body must be a JSON object");
  }
  return value as Record<string, unknown>;
}

function requiredText(
  value: unknown,
  label: string,
  minimum: number,
  maximum: number,
): string {
  if (typeof value !== "string") {
    throw new ApiError(400, `${label} is required`);
  }
  const text = value.trim();
  if (text.length < minimum || text.length > maximum) {
    throw new ApiError(400, `${label} must be between ${minimum} and ${maximum} characters`);
  }
  return text;
}

function parseEmail(value: unknown): string {
  const email = requiredText(value, "Business email", 3, 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ApiError(400, "A valid business email address is required");
  }
  return email;
}

function parseAddress(value: unknown): OrganizationCompanyDraft["address"] {
  const address = getObjectBody(value);
  return {
    street: requiredText(address.street, "Street address", 2, 180),
    city: requiredText(address.city, "City", 2, 100),
    region: requiredText(address.region, "State, province, or region", 2, 100),
    postalCode: requiredText(address.postalCode, "Postal code", 2, 20),
    country: requiredText(address.country, "Country", 2, 80),
  };
}

function parseDate(value: unknown, label: string): string {
  const date = requiredText(value, label, 10, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new ApiError(400, `${label} must use YYYY-MM-DD format`);
  }
  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new ApiError(400, `${label} must be a valid calendar date`);
  }
  return date;
}

export function parseOnboardingDraft(value: unknown): OnboardingDraftInput {
  const body = getObjectBody(value);
  const data = getObjectBody(body.data);
  if (body.step === "company") {
    const phone = requiredText(data.phone, "Phone number", 7, 30);
    if (!/^[+()\d.\-\s]+$/.test(phone)) {
      throw new ApiError(400, "Phone number contains unsupported characters");
    }
    return {
      step: "company",
      data: {
        companyName: requiredText(data.companyName, "Company name", 2, 160),
        businessEmail: parseEmail(data.businessEmail),
        phone,
        address: parseAddress(data.address),
      },
    };
  }
  if (body.step === "contact") {
    return {
      step: "contact",
      data: {
        name: requiredText(data.name, "Contact name", 2, 100),
        designation: requiredText(data.designation, "Contact designation", 2, 100),
      },
    };
  }
  if (body.step === "firstProject") {
    const startDate = parseDate(data.startDate, "Project start date");
    const endDate = parseDate(data.endDate, "Project end date");
    if (endDate < startDate) {
      throw new ApiError(400, "Project end date must be on or after the start date");
    }
    return {
      step: "firstProject",
      data: {
        name: requiredText(data.name, "Project name", 2, 160),
        siteAddress: requiredText(data.siteAddress, "Site address", 5, 240),
        location: requiredText(data.location, "Project location", 2, 160),
        startDate,
        endDate,
      },
    };
  }
  throw new ApiError(400, "A valid onboarding step is required");
}

export function getNextOnboardingStep(step: OnboardingStep): OnboardingStep {
  if (step === "company") return "contact";
  if (step === "contact") return "firstProject";
  return "review";
}
