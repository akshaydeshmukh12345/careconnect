import { Router } from "express";

import {
  getAdminStats,
} from "../controllers/adminController";

import { protect } from "../middleware/authMiddleware";
import { adminOnly } from "../middleware/adminMiddleware";

const router = Router();

// Admin test
router.get(
  "/test",
  protect,
  adminOnly,
  (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access confirmed",
    });
  }
);

// Admin dashboard statistics
router.get(
  "/stats",
  protect,
  adminOnly,
  getAdminStats
);

export default router;