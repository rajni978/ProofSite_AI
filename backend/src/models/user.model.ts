import { HydratedDocument, model, Model, Schema, Types } from "mongoose";
import { comparePassword as verifyPassword, hashPassword } from "../utils/password";

export const USER_ROLES = [
  "ADMIN",
  "SUBCONTRACTOR",
  "SUPERVISOR",
  "WORKER",
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ["ACTIVE", "DISABLED"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const ONBOARDING_STATUSES = [
  "NOT_REQUIRED",
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
] as const;
export type OnboardingStatus = (typeof ONBOARDING_STATUSES)[number];

export interface UserFields {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  organizationId?: Types.ObjectId | null;
  onboardingStatus: OnboardingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type UserDocument = HydratedDocument<UserFields, UserMethods>;
type UserModel = Model<UserFields, object, UserMethods>;

const userSchema = new Schema<UserFields, UserModel, UserMethods>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: USER_ROLES,
      default: "WORKER",
      required: true,
    },
    status: {
      type: String,
      enum: USER_STATUSES,
      default: "ACTIVE",
      required: true,
    },
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },
    onboardingStatus: {
      type: String,
      enum: ONBOARDING_STATUSES,
      default: function (this: UserFields) {
        return this.role === "ADMIN" ? "NOT_STARTED" : "NOT_REQUIRED";
      },
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_document, value) => {
        const safeValue: Record<string, unknown> = { ...value };
        delete safeValue.password;
        delete safeValue.__v;
        return safeValue;
      },
    },
  },
);

userSchema.pre("init", function (data: Record<string, unknown>) {
  if (
    data.status === undefined &&
    (data.accountStatus === "ACTIVE" || data.accountStatus === "DISABLED")
  ) {
    data.status = data.accountStatus;
  }
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
});

userSchema.method(
  "comparePassword",
  async function comparePassword(candidatePassword: string): Promise<boolean> {
    return verifyPassword(candidatePassword, this.password);
  },
);

export const User = model<UserFields, UserModel>("User", userSchema);
