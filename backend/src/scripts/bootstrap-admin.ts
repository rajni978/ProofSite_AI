import "dotenv/config";
import { stdin, stdout } from "node:process";
import { createInterface } from "node:readline/promises";
import mongoose from "mongoose";
import { ApiError } from "../utils/api-error";
import { getServerEnvironment } from "../config/environment";
import { User } from "../models/user.model";
import { parseRegistrationInput } from "../middleware/validate-auth";

const BOOTSTRAP_COLLECTION = "system_bootstrap";
const INITIAL_ADMIN_KEY = "initial-admin-provisioned";

function readHiddenInput(label: string): Promise<string> {
  if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
    return Promise.reject(new Error("Run this command from an interactive terminal"));
  }

  return new Promise((resolve, reject) => {
    let value = "";
    stdout.write(label);
    stdin.setRawMode(true);
    stdin.resume();

    const finish = (error?: Error) => {
      stdin.off("data", onData);
      stdin.setRawMode(false);
      stdout.write("\n");
      if (error) reject(error);
      else resolve(value);
    };

    const onData = (chunk: Buffer | string) => {
      for (const character of chunk.toString()) {
        if (character === "\u0003") {
          finish(new Error("Administrator setup cancelled"));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish();
          return;
        }
        if (character === "\u007f" || character === "\b") {
          value = value.slice(0, -1);
          continue;
        }
        if (character >= " ") value += character;
      }
    };

    stdin.on("data", onData);
  });
}

function getErrorCode(error: unknown): number | undefined {
  if (typeof error !== "object" || error === null || !("code" in error)) {
    return undefined;
  }
  return typeof error.code === "number" ? error.code : undefined;
}

async function provisionInitialAdmin(): Promise<void> {
  const { MONGODB_URI } = getServerEnvironment();
  await mongoose.connect(MONGODB_URI);
  await User.init();
  const database = mongoose.connection.db;
  if (!database) throw new Error("MongoDB connection is not ready");
  const bootstrapCollection = database.collection<{ _id: string; createdAt: Date }>(
    BOOTSTRAP_COLLECTION,
  );

  const admins = await User.countDocuments({ role: "ADMIN" });
  const bootstrapRecord = await bootstrapCollection.findOne({ _id: INITIAL_ADMIN_KEY });
  if (admins > 0 || bootstrapRecord) {
    throw new ApiError(409, "Initial administrator provisioning has already been used");
  }

  const prompts = createInterface({ input: stdin, output: stdout });
  const fullName = await prompts.question("Administrator full name: ");
  const email = await prompts.question("Administrator work email: ");
  prompts.close();
  const password = await readHiddenInput("Choose a password (input hidden): ");
  const confirmPassword = await readHiddenInput("Confirm password (input hidden): ");
  if (password !== confirmPassword) {
    throw new ApiError(400, "The passwords do not match");
  }
  const input = parseRegistrationInput({ fullName, email, password });

  try {
    await database.createCollection(BOOTSTRAP_COLLECTION);
  } catch (error) {
    if (getErrorCode(error) !== 48) throw error;
  }

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const currentAdmins = await User.countDocuments({ role: "ADMIN" }).session(session);
      const currentBootstrap = await bootstrapCollection.findOne(
        { _id: INITIAL_ADMIN_KEY },
        { session },
      );
      if (currentAdmins > 0 || currentBootstrap) {
        throw new ApiError(409, "Initial administrator provisioning has already been used");
      }
      await bootstrapCollection.insertOne(
        { _id: INITIAL_ADMIN_KEY, createdAt: new Date() },
        { session },
      );
      await User.create(
        [{
          ...input,
          role: "ADMIN",
          onboardingStatus: "NOT_STARTED",
        }],
        { session },
      );
    });
  } finally {
    await session.endSession();
  }

  console.log("Initial administrator created. Sign in to complete company onboarding.");
}

void provisionInitialAdmin()
  .catch((error: unknown) => {
    if (error instanceof ApiError) {
      console.error(`Administrator setup failed: ${error.message}`);
    } else if (getErrorCode(error) === 11000) {
      console.error("Administrator setup failed: initial administrator provisioning has already been used");
    } else if (error instanceof Error && error.message === "Run this command from an interactive terminal") {
      console.error(`Administrator setup failed: ${error.message}`);
    } else {
      const errorType = error instanceof Error ? error.name : "UnknownError";
      console.error(`Administrator setup failed (${errorType}). Verify the configured MongoDB connection and retry.`);
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
