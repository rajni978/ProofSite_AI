import "dotenv/config";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { test } from "node:test";
import mongoose from "mongoose";
import app from "../src/app";
import { Organization } from "../src/models/organization.model";
import { Project } from "../src/models/project.model";
import { User } from "../src/models/user.model";
import { signAuthToken } from "../src/utils/jwt";

const company = {
  companyName: "Northline Construction",
  businessEmail: "office@northline.example",
  phone: "+1 (206) 555-0123",
  address: {
    street: "100 Main Street",
    city: "Seattle",
    region: "Washington",
    postalCode: "98101",
    country: "United States",
  },
};

const contact = { name: "Taylor Morgan", designation: "Project Director" };

const firstProject = {
  name: "Riverside Tower",
  siteAddress: "200 River Avenue",
  location: "Portland, Oregon",
  startDate: "2027-04-01",
  endDate: "2028-08-31",
};

test(
  "onboarding persists drafts, enforces ADMIN access, and completes transactionally and idempotently",
  { skip: !process.env.MONGODB_URI || !process.env.JWT_SECRET },
  async (context) => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri || !process.env.JWT_SECRET) {
      context.skip("MONGODB_URI and JWT_SECRET are required for integration tests");
      return;
    }

    const suffix = randomBytes(12).toString("hex");
    const adminEmail = `onboarding-admin-${suffix}@example.com`;
    const workerEmail = `onboarding-worker-${suffix}@example.com`;
    let connected = false;
    let server: ReturnType<typeof app.listen> | undefined;
    let adminId: string | undefined;
    let workerId: string | undefined;

    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 8000 });
      connected = true;
      await Promise.all([Organization.init(), Project.init()]);

      const admin = await User.create({
        fullName: "Onboarding Admin",
        email: adminEmail,
        password: "temporary-admin-password",
        role: "ADMIN",
      });
      adminId = admin.id;
      const worker = await User.create({
        fullName: "Onboarding Worker",
        email: workerEmail,
        password: "temporary-worker-password",
        role: "WORKER",
      });
      workerId = worker.id;

      server = app.listen(0);
      await once(server, "listening");
      const address = server.address();
      assert.ok(address && typeof address !== "string");
      const baseUrl = `http://127.0.0.1:${(address as AddressInfo).port}/api/onboarding`;
      const adminHeaders = {
        authorization: `Bearer ${signAuthToken(admin.id)}`,
        "content-type": "application/json",
      };
      const workerHeaders = {
        authorization: `Bearer ${signAuthToken(worker.id)}`,
        "content-type": "application/json",
      };

      const unauthenticated = await fetch(baseUrl);
      assert.equal(unauthenticated.status, 401);
      const forbidden = await fetch(baseUrl, { headers: workerHeaders });
      assert.equal(forbidden.status, 403);

      const initial = await fetch(baseUrl, { headers: adminHeaders });
      assert.equal(initial.status, 200);
      assert.deepEqual(await initial.json(), { onboarding: null });

      const invalidDraft = await fetch(`${baseUrl}/draft`, {
        method: "PUT",
        headers: adminHeaders,
        body: JSON.stringify({ step: "company", data: { ...company, businessEmail: "bad" } }),
      });
      assert.equal(invalidDraft.status, 400);

      const companySaved = await fetch(`${baseUrl}/draft`, {
        method: "PUT",
        headers: adminHeaders,
        body: JSON.stringify({ step: "company", data: company }),
      });
      assert.equal(companySaved.status, 200);
      assert.equal((await companySaved.json()).onboarding.currentStep, "contact");

      const skippedContact = await fetch(`${baseUrl}/draft`, {
        method: "PUT",
        headers: adminHeaders,
        body: JSON.stringify({ step: "firstProject", data: firstProject }),
      });
      assert.equal(skippedContact.status, 409);

      const incompleteCompletion = await fetch(`${baseUrl}/complete`, {
        method: "POST",
        headers: adminHeaders,
      });
      assert.equal(incompleteCompletion.status, 400);

      const contactSaved = await fetch(`${baseUrl}/draft`, {
        method: "PUT",
        headers: adminHeaders,
        body: JSON.stringify({ step: "contact", data: contact }),
      });
      assert.equal(contactSaved.status, 200);

      const projectSaved = await fetch(`${baseUrl}/draft`, {
        method: "PUT",
        headers: adminHeaders,
        body: JSON.stringify({ step: "firstProject", data: firstProject }),
      });
      assert.equal(projectSaved.status, 200);
      assert.equal((await projectSaved.json()).onboarding.currentStep, "review");

      const invalidCompletion = await fetch(`${baseUrl}/complete`, {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({ organizationId: "must-not-be-accepted" }),
      });
      assert.equal(invalidCompletion.status, 400);

      const completed = await fetch(`${baseUrl}/complete`, {
        method: "POST",
        headers: adminHeaders,
      });
      assert.equal(completed.status, 201);
      const completionBody = await completed.json();
      assert.equal(completionBody.onboarding.status, "COMPLETED");
      assert.equal(completionBody.project.name, firstProject.name);

      const repeatedCompletion = await fetch(`${baseUrl}/complete`, {
        method: "POST",
        headers: adminHeaders,
      });
      assert.equal(repeatedCompletion.status, 200);
      assert.equal((await repeatedCompletion.json()).project.id, completionBody.project.id);

      const persisted = await fetch(baseUrl, { headers: adminHeaders });
      const persistedBody = await persisted.json();
      assert.equal(persistedBody.onboarding.status, "COMPLETED");
      assert.equal(persistedBody.onboarding.company.companyName, company.companyName);
      assert.equal(
        await Project.countDocuments({ organizationId: completionBody.organization.id }),
        1,
      );

      const refreshedAdmin = await User.findById(admin.id);
      assert.equal(refreshedAdmin?.onboardingStatus, "COMPLETED");
      assert.equal(refreshedAdmin?.organizationId?.toString(), completionBody.organization.id);
    } finally {
      if (server?.listening) {
        await new Promise<void>((resolve, reject) => {
          server?.close((error) => (error ? reject(error) : resolve()));
        });
      }
      if (connected) {
        if (adminId) {
          const organization = await Organization.findOne({ ownerUserId: adminId });
          if (organization) {
            await Project.deleteMany({ organizationId: organization._id });
            await Organization.deleteOne({ _id: organization._id });
          }
        }
        await User.deleteMany({
          _id: { $in: [adminId, workerId].filter(Boolean) },
        });
        await mongoose.disconnect();
      }
    }
  },
);
