import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/environment";

const TOKEN_ISSUER = "proofsite-ai";
const TOKEN_EXPIRY = "1h";

export function signAuthToken(userId: string): string {
  return jwt.sign({}, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: TOKEN_EXPIRY,
    issuer: TOKEN_ISSUER,
    subject: userId,
  });
}

export function verifyAuthToken(token: string): string {
  const payload = jwt.verify(token, getJwtSecret(), {
    algorithms: ["HS256"],
    issuer: TOKEN_ISSUER,
  });

  if (typeof payload === "string" || typeof payload.sub !== "string") {
    throw new Error("Token subject is invalid");
  }

  return payload.sub;
}
