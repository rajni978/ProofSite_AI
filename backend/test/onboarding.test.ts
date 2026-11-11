import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getNextOnboardingStep,
  parseOnboardingDraft,
} from "../src/middleware/validate-onboarding";

const company = {
  companyName: "  Northline Construction ",
  businessEmail: " OFFICE@NORTHLINE.EXAMPLE ",
  phone: "+1 (206) 555-0123",
  address: {
    street: "100 Main Street",
    city: "Seattle",
    region: "Washington",
    postalCode: "98101",
    country: "United States",
  },
};

test("company onboarding input is normalized and allow-listed", () => {
  assert.deepEqual(
    parseOnboardingDraft({
      step: "company",
      data: { ...company, role: "ADMIN", ownerUserId: "attacker-controlled" },
    }),
    {
      step: "company",
      data: {
        companyName: "Northline Construction",
        businessEmail: "office@northline.example",
        phone: "+1 (206) 555-0123",
        address: company.address,
      },
    },
  );
});

test("onboarding validation rejects invalid email, phone, and dates", () => {
  assert.throws(
    () => parseOnboardingDraft({ step: "company", data: { ...company, businessEmail: "invalid" } }),
    /valid business email/,
  );
  assert.throws(
    () => parseOnboardingDraft({ step: "company", data: { ...company, phone: "call me" } }),
    /unsupported characters/,
  );
  assert.throws(
    () => parseOnboardingDraft({
      step: "firstProject",
      data: {
        name: "Tower",
        siteAddress: "1 Main Street",
        location: "Seattle",
        startDate: "2026-02-29",
        endDate: "2026-03-01",
      },
    }),
    /valid calendar date/,
  );
  assert.throws(
    () => parseOnboardingDraft({
      step: "firstProject",
      data: {
        name: "Tower",
        siteAddress: "1 Main Street",
        location: "Seattle",
        startDate: "2027-05-01",
        endDate: "2027-04-30",
      },
    }),
    /on or after/,
  );
});

test("onboarding steps advance to the next persisted step", () => {
  assert.equal(getNextOnboardingStep("company"), "contact");
  assert.equal(getNextOnboardingStep("contact"), "firstProject");
  assert.equal(getNextOnboardingStep("firstProject"), "review");
});
