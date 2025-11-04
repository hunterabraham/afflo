import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "~/env";
import { errorHandler } from "~/server/api/express-error";
import apiRoutes from "~/server/api";
import { timingMiddleware, loadSession } from "~/server/api/middleware";

const app = express();
const PORT = process.env.PORT || 8080;

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

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("=".repeat(80));
  console.error("UNCAUGHT EXCEPTION:", new Date().toISOString());
  console.error("Error:", error);
  console.error("Stack:", error.stack);
  console.error("=".repeat(80));
  // Don't exit in development so we can see the error
  if (process.env.NODE_ENV !== "development") {
    process.exit(1);
  }
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("=".repeat(80));
  console.error("UNHANDLED REJECTION:", new Date().toISOString());
  console.error("Reason:", reason);
  if (reason instanceof Error) {
    console.error("Stack:", reason.stack);
  }
  console.error("Promise:", promise);
  console.error("=".repeat(80));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
  console.log(
    `🌐 CORS Origin: ${process.env.CORS_ORIGIN || "http://localhost:3000"}`,
  );
  console.log(
    `📊 Database URL: ${process.env.DATABASE_URL ? "configured" : "not configured"}`,
  );
});

export default app;
