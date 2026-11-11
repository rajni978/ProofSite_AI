import { model, Schema, Types } from "mongoose";

export interface ProjectFields {
  organizationId: Types.ObjectId;
  name: string;
  siteAddress: string;
  location: string;
  startDate: Date;
  endDate: Date;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<ProjectFields>(
  {
    organizationId: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true, maxlength: 160 },
    siteAddress: { type: String, required: true, trim: true, maxlength: 240 },
    location: { type: String, required: true, trim: true, maxlength: 160 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

export const Project = model<ProjectFields>("Project", projectSchema);
