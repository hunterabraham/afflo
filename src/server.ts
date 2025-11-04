import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "~/env";
import { errorHandler } from "~/server/api/express-error";
import partnerRoutes from "~/server/api/routes/partner";
import affiliateRoutes from "~/server/api/routes/affiliate";
import affiliateEventRoutes from "~/server/api/routes/affiliate-event";
import adminRoutes from "~/server/api/routes/admin";
import authRoutes from "~/server/api/routes/auth";
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

// API Routes
app.use("/api/partner", partnerRoutes);
app.use("/api/affiliate", affiliateRoutes);
app.use("/api/affiliate-event", affiliateEventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
});

export default app;
