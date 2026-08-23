import { Router } from "express";

import {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  rescheduleAppointment,
  updateAppointmentStatus,
} from "../controllers/appointmentController";

import { protect } from "../middleware/authMiddleware";

const router = Router();

// =========================
// PATIENT APPOINTMENTS
// =========================

// Book appointment
router.post("/", protect, createAppointment);

// Get logged-in patient's appointments
router.get("/my", protect, getMyAppointments);

// Cancel appointment - patient
router.patch(
  "/:id/cancel",
  protect,
  cancelAppointment
);

// Reschedule appointment - patient
router.patch(
  "/:id/reschedule",
  protect,
  rescheduleAppointment
);

// =========================
// DOCTOR APPOINTMENTS
// =========================

// Update appointment status
// confirmed / cancelled / completed
router.patch(
  "/:id/status",
  protect,
  updateAppointmentStatus
);

export default router;