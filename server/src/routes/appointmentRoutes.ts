import { Router } from "express";
import {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
} from "../controllers/appointmentController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Book appointment
router.post("/", protect, createAppointment);

// Get logged-in patient's appointments
router.get("/my", protect, getMyAppointments);

// Cancel appointment
router.patch("/:id/cancel", protect, cancelAppointment);

export default router;