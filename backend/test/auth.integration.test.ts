import "dotenv/config";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { once } from "node:events";
import type { AddressInfo } from "node:net";
import { test } from "node:test";
import mongoose from "mongoose";
import app from "../src/app";
import { User } from "../src/models/user.model";

test(
  "registration, login, duplicate rejection, and protected profile endpoint",
  { skip: !process.env.MONGODB_URI || !process.env.JWT_SECRET },
  async (context) => {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri || !process.env.JWT_SECRET) {
      context.skip("MONGODB_URI and JWT_SECRET are required for integration tests");
      return;
    }

    const email = `auth-test-${randomBytes(12).toString("hex")}@example.com`;
    const password = "temporary-test-password";
    let connected = false;
    let server: ReturnType<typeof app.listen> | undefined;

    try {
      await mongoose.connect(mongoUri);
      connected = true;

      server = app.listen(0);
      await once(server, "listening");
      const address = server.address();
      assert.ok(address && typeof address !== "string");
      const baseUrl = `http://127.0.0.1:${(address as AddressInfo).port}/api/auth`;

      const unauthenticatedResponse = await fetch(`${baseUrl}/me`);
      assert.equal(unauthenticatedResponse.status, 401);

      const registrationResponse = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: "Integration Test User",
          email,
          password,
          role: "ADMIN",
        }),
      });
      assert.equal(registrationResponse.status, 201);
      const registration = (await registrationResponse.json()) as {
        user: Record<string, unknown> & { id: string; role: string; status: string };
        token: string;
      };
      assert.equal(registration.user.role, "WORKER");
      assert.equal(registration.user.status, "ACTIVE");
      assert.equal("password" in registration.user, false);
      assert.equal(typeof registration.token, "string");

      const duplicateResponse = await fetch(`${baseUrl}/register`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          fullName: "Integration Test User",
          email,
          password,
        }),
      });
      assert.equal(duplicateResponse.status, 409);

      const invalidLoginResponse = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password: "incorrect-test-password" }),
      });
      assert.equal(invalidLoginResponse.status, 401);

      const loginResponse = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      assert.equal(loginResponse.status, 200);
      const login = (await loginResponse.json()) as {
        user: Record<string, unknown>;
        token: string;
      };
      assert.equal("password" in login.user, false);
      assert.equal(typeof login.token, "string");

      const profileResponse = await fetch(`${baseUrl}/me`, {
        headers: { authorization: `Bearer ${login.token}` },
      });
      assert.equal(profileResponse.status, 200);
      const profile = (await profileResponse.json()) as {
        user: Record<string, unknown> & { email: string; status: string };
      };
      assert.equal(profile.user.email, email);
      assert.equal(profile.user.status, "ACTIVE");
      assert.equal("password" in profile.user, false);
    } finally {
      if (server?.listening) {
        await new Promise<void>((resolve, reject) => {
          server?.close((error) => (error ? reject(error) : resolve()));
        });
      }
      if (connected) {
        await User.deleteOne({ email });
        await mongoose.disconnect();
      }
    }
  },
);
