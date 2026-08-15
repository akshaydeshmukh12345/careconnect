import { Router } from "express";

import {
  getProfile,
  updateProfile,
  getHealthProfile,
  updateHealthProfile,
} from "../controllers/userController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

// USER PROFILE

router.get(
  "/profile",
  protect,
  getProfile
);

router.patch(
  "/profile",
  protect,
  updateProfile
);

// HEALTH PROFILE

router.get(
  "/health-profile",
  protect,
  getHealthProfile
);

router.put(
  "/health-profile",
  protect,
  updateHealthProfile
);

export default router;