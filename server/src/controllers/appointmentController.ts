import { Response } from "express";
import Appointment from "../models/Appointment";
import { AuthRequest } from "../middleware/authMiddleware";

export const createAppointment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const { doctor, appointmentDate, reason } = req.body;

    if (!doctor || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message: "Doctor and appointment date are required",
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      appointmentDate,
      reason,
    });

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};