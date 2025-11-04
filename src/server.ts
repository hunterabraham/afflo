import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "~/env";
import { errorHandler } from "~/server/api/express-error";
import apiRoutes from "~/server/api";
import { timingMiddleware, loadSession } from "~/server/api/middleware";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use(loadSession); // Load session for all routes
app.use(timingMiddleware);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// API Routes - all routes grouped in api/index.ts
app.use("/api", apiRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
});

export default app;
