import { Router } from "express";
import {
  getProfile,
  updateProfile,
} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Get logged-in user's profile
router.get("/profile", protect, getProfile);

// Update logged-in user's profile
router.patch("/profile", protect, updateProfile);

export default router;