import "dotenv/config";
import app from "./app";
import { connectToDatabase } from "./config/database";
import { getServerEnvironment } from "./config/environment";

async function startServer(): Promise<void> {
  const environment = getServerEnvironment();

  await connectToDatabase(environment.MONGODB_URI);

  app.listen(environment.PORT, () => {
    console.log(`ProofSite AI API listening on port ${environment.PORT}`);
  });
}

void startServer().catch((error: unknown) => {
  const configError =
    error instanceof Error &&
    /^(PORT|MONGODB_URI|JWT_SECRET) must /.test(error.message);
  if (configError && error instanceof Error) {
    console.error(`Unable to start ProofSite AI API: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const errorType =
    error instanceof Error &&
    [
      "MongoServerError",
      "MongooseServerSelectionError",
      "MongoNetworkError",
      "MongoParseError",
    ].includes(error.name)
      ? error.name
      : "UnknownError";
  const errorCode =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (typeof error.code === "number" ||
      (typeof error.code === "string" &&
        [
          "ENOTFOUND",
          "EAI_AGAIN",
          "ECONNREFUSED",
          "ECONNRESET",
          "ETIMEDOUT",
        ].includes(error.code)))
      ? error.code
      : "unknown";
  const category =
    errorCode === 18 || errorCode === 8000
      ? "authentication"
      : errorCode === "ENOTFOUND" || errorCode === "EAI_AGAIN"
        ? "dns"
        : errorType === "MongoParseError"
          ? "invalid-connection-string"
          : errorCode === "ECONNREFUSED" ||
              errorCode === "ECONNRESET" ||
              errorCode === "ETIMEDOUT" ||
              errorType === "MongooseServerSelectionError" ||
              errorType === "MongoNetworkError"
            ? "network-or-server-selection"
            : "mongodb-connection";

  console.error("Unable to start ProofSite AI API", {
    errorType,
    errorCode,
    category,
  });
  process.exitCode = 1;
});
