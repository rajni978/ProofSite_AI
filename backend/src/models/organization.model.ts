import { model, Schema, Types } from "mongoose";

export interface OrganizationAddress {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface OrganizationCompanyDraft {
  companyName: string;
  businessEmail: string;
  phone: string;
  address: OrganizationAddress;
}

export interface OrganizationContactDraft {
  name: string;
  designation: string;
}

export interface OrganizationProjectDraft {
  name: string;
  siteAddress: string;
  location: string;
  startDate: string;
  endDate: string;
}

export type OnboardingStep = "company" | "contact" | "firstProject" | "review";

export interface OrganizationFields {
  ownerUserId: Types.ObjectId;
  company?: Partial<OrganizationCompanyDraft>;
  contact?: Partial<OrganizationContactDraft>;
  firstProject?: Partial<OrganizationProjectDraft>;
  currentStep: OnboardingStep;
  onboardingStatus: "IN_PROGRESS" | "COMPLETED";
  initialProjectId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<OrganizationAddress>(
  {
    street: { type: String, trim: true, maxlength: 180 },
    city: { type: String, trim: true, maxlength: 100 },
    region: { type: String, trim: true, maxlength: 100 },
    postalCode: { type: String, trim: true, maxlength: 20 },
    country: { type: String, trim: true, maxlength: 80 },
  },
  { _id: false },
);

const companySchema = new Schema<OrganizationCompanyDraft>(
  {
    companyName: { type: String, trim: true, maxlength: 160 },
    businessEmail: { type: String, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, trim: true, maxlength: 30 },
    address: { type: addressSchema },
  },
  { _id: false },
);

const contactSchema = new Schema<OrganizationContactDraft>(
  {
    name: { type: String, trim: true, maxlength: 100 },
    designation: { type: String, trim: true, maxlength: 100 },
  },
  { _id: false },
);

const projectDraftSchema = new Schema<OrganizationProjectDraft>(
  {
    name: { type: String, trim: true, maxlength: 160 },
    siteAddress: { type: String, trim: true, maxlength: 240 },
    location: { type: String, trim: true, maxlength: 160 },
    startDate: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ },
    endDate: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ },
  },
  { _id: false },
);

const organizationSchema = new Schema<OrganizationFields>(
  {
    ownerUserId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    company: { type: companySchema, default: undefined },
    contact: { type: contactSchema, default: undefined },
    firstProject: { type: projectDraftSchema, default: undefined },
    currentStep: {
      type: String,
      enum: ["company", "contact", "firstProject", "review"],
      default: "company",
      required: true,
    },
    onboardingStatus: {
      type: String,
      enum: ["IN_PROGRESS", "COMPLETED"],
      default: "IN_PROGRESS",
      required: true,
    },
    initialProjectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
  },
  { timestamps: true },
);

export const Organization = model<OrganizationFields>(
  "Organization",
  organizationSchema,
);
