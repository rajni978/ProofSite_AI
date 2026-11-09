import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/error-handler";
import { notFoundHandler } from "./middleware/not-found";
import { authRouter } from "./routes/auth.routes";
import { healthRouter } from "./routes/health.routes";

const app = express();
const frontendOrigin = process.env.FRONTEND_URL ?? "http://localhost:3000";

app.use(cors({ origin: frontendOrigin }));
app.use(express.json());
app.use("/api", healthRouter);
app.use("/api/auth", authRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
