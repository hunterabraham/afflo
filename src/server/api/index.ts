import { Router } from "express";
import authRoutes from "./routes/auth";
import partnerRoutes from "./routes/partner";
import affiliateRoutes from "./routes/affiliate";
import affiliateEventRoutes from "./routes/affiliate-event";
import adminRoutes from "./routes/admin";
import { loadPartner, requireAuth } from "./middleware";

/**
 * Main API router that groups all sub-routes
 *
 * This router serves as the central entry point for all API routes.
 * Each sub-route is mounted at its respective path prefix.
 *
 * Middleware is applied globally:
 * - loadPartner: Loads partner info for authenticated users (safe to apply to all routes)
 * - requireAuth: Required for all routes except /auth (which handles authentication)
 */
const router = Router();

router.use(loadPartner);
router.use(requireAuth);

router.use("/auth", authRoutes);
router.use("/partner", partnerRoutes);
router.use("/affiliate", affiliateRoutes);
router.use("/affiliate-event", affiliateEventRoutes);
router.use("/admin", adminRoutes);

export default router;
