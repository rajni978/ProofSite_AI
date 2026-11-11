import mongoose from "mongoose";
import { Organization } from "../models/organization.model";
import { Project } from "../models/project.model";

export async function connectToDatabase(uri: string): Promise<void> {
  await mongoose.connect(uri);
  await Promise.all([Organization.init(), Project.init()]);
  console.log("Connected to MongoDB");
}
