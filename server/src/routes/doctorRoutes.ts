import { Router } from "express";

import {
  getDoctors,
  createDoctor,
  getDoctorDashboard,
} from "../controllers/doctorController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

// =========================
// PUBLIC
// =========================

// Get all doctors
router.get("/", getDoctors);

// Create doctor
router.post("/", createDoctor);


// =========================
// PROTECTED
// =========================

// Doctor dashboard
router.get(
  "/dashboard",
  protect,
  getDoctorDashboard
);

export default router;