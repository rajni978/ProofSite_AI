export interface ServerEnvironment {
  PORT: number;
  FRONTEND_URL: string;
  MONGODB_URI: string;
  JWT_SECRET: string;
}

export function getJwtSecret(env: NodeJS.ProcessEnv = process.env): string {
  const jwtSecret = env.JWT_SECRET;
  if (!jwtSecret || Buffer.byteLength(jwtSecret.trim(), "utf8") < 32) {
    throw new Error("JWT_SECRET must be at least 32 bytes long");
  }
  return jwtSecret;
}

export function getServerEnvironment(
  env: NodeJS.ProcessEnv = process.env,
): ServerEnvironment {
  const port = Number(env.PORT ?? 5000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  const mongoUri = env.MONGODB_URI?.trim();
  if (!mongoUri) {
    throw new Error("MONGODB_URI must be configured");
  }

  return {
    PORT: port,
    FRONTEND_URL: env.FRONTEND_URL ?? "http://localhost:3000",
    MONGODB_URI: mongoUri,
    JWT_SECRET: getJwtSecret(env),
  };
}
