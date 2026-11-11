import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { test } from "node:test";
import { getServerEnvironment } from "../src/config/environment";
import { authorizeRoles } from "../src/middleware/authorize-roles";
import { parseLoginInput, parseRegistrationInput } from "../src/middleware/validate-auth";
import { User } from "../src/models/user.model";
import { comparePassword, hashPassword } from "../src/utils/password";
import { signAuthToken, verifyAuthToken } from "../src/utils/jwt";

process.env.JWT_SECRET = randomBytes(32).toString("base64");

test("registration normalizes user data and never accepts a supplied role", () => {
  const input = parseRegistrationInput({
    fullName: "  Alex Worker ",
    email: "  ALEX@example.com ",
    password: "passphrase-123",
    role: "ADMIN",
  });

  assert.deepEqual(input, {
    fullName: "Alex Worker",
    email: "alex@example.com",
    password: "passphrase-123",
  });
});

test("registration rejects passwords beyond bcrypt's byte limit", () => {
  assert.throws(
    () =>
      parseRegistrationInput({
        fullName: "Alex Worker",
        email: "alex@example.com",
        password: "é".repeat(37),
      }),
    /at most 72 bytes/,
  );
});

test("login validates and normalizes its email", () => {
  assert.deepEqual(parseLoginInput({ email: " USER@example.com ", password: "secret" }), {
    email: "user@example.com",
    password: "secret",
  });
});

test("user defaults are safe and serialized users omit passwords", () => {
  const user = new User({
    fullName: "Alex Worker",
    email: "alex@example.com",
    password: "already-hashed-value",
  });
  const serializedUser = user.toJSON() as Record<string, unknown>;

  assert.equal(user.role, "WORKER");
  assert.equal(user.status, "ACTIVE");
  assert.equal(user.onboardingStatus, "NOT_REQUIRED");
  assert.equal("password" in serializedUser, false);
  assert.equal(serializedUser.onboardingStatus, "NOT_REQUIRED");
  assert.equal("password" in User.schema.paths, true);
  assert.equal(User.schema.path("password").options.select, false);

  const legacyDisabledUser = User.hydrate({
    _id: "507f1f77bcf86cd799439011",
    fullName: "Legacy User",
    email: "legacy@example.com",
    password: "hashed-password",
    role: "WORKER",
    accountStatus: "DISABLED",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  assert.equal(legacyDisabledUser.status, "DISABLED");
});

test("administrator users require onboarding by default", () => {
  const user = new User({
    fullName: "Main Contractor",
    email: "admin@example.com",
    password: "already-hashed-value",
    role: "ADMIN",
  });

  assert.equal(user.onboardingStatus, "NOT_STARTED");

  const legacyAdmin = User.hydrate({
    _id: "507f1f77bcf86cd799439012",
    fullName: "Legacy Admin",
    email: "legacy-admin@example.com",
    password: "hashed-password",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  assert.equal(legacyAdmin.onboardingStatus, "NOT_STARTED");
});

test("password hashing can be verified without retaining the plain password", async () => {
  const password = "correct horse battery staple";
  const passwordHash = await hashPassword(password);

  assert.notEqual(passwordHash, password);
  assert.equal(await comparePassword(password, passwordHash), true);
  assert.equal(await comparePassword("incorrect password", passwordHash), false);
});

test("server configuration requires a MongoDB URI and strong JWT secret", () => {
  assert.throws(
    () => getServerEnvironment({ PORT: "5000", JWT_SECRET: "short" }),
    /MONGODB_URI must be configured/,
  );
  assert.throws(
    () =>
      getServerEnvironment({
        PORT: "5000",
        MONGODB_URI: "mongodb://localhost/proofsite_ai",
        JWT_SECRET: "short",
      }),
    /JWT_SECRET must be at least 32 bytes long/,
  );
});

test("JWTs are signed and verified with the configured secret", () => {
  const token = signAuthToken("507f1f77bcf86cd799439011");

  assert.equal(verifyAuthToken(token), "507f1f77bcf86cd799439011");
  assert.throws(() => verifyAuthToken(`${token}invalid`));
});

test("role authorization denies a worker from an admin-only operation", () => {
  const middleware = authorizeRoles("ADMIN");
  let forwardedError: unknown;
  const next = (error?: unknown) => {
    forwardedError = error;
  };

  middleware(
    { authUser: { userId: "worker-id", role: "WORKER" } } as never,
    {} as never,
    next,
  );

  assert.equal(forwardedError instanceof Error, true);
  assert.equal((forwardedError as Error).message, "You do not have permission to access this resource");
});
