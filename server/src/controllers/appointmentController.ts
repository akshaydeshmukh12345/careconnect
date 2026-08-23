import { Response } from "express";

import Appointment from "../models/Appointment";

import { AuthRequest } from "../middleware/authMiddleware";

// =====================================================
// CREATE APPOINTMENT
// =====================================================

export const createAppointment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      doctor,
      appointmentDate,
      reason,
    } = req.body;

    // Check required fields
    if (!doctor || !appointmentDate) {
      return res.status(400).json({
        success: false,
        message:
          "Doctor and appointment date are required",
      });
    }

    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Create appointment
    const appointment =
      await Appointment.create({
        patient: req.user.id,
        doctor,
        appointmentDate,
        reason,
      });

    return res.status(201).json({
      success: true,
      message:
        "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error(
      "Create appointment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================================
// GET MY APPOINTMENTS
// =====================================================

export const getMyAppointments = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Get patient's appointments
    const appointments =
      await Appointment.find({
        patient: req.user.id,
      })
        .populate(
          "doctor",
          "name specialization experience qualification consultationFee"
        )
        .sort({
          appointmentDate: 1,
        });

    return res.status(200).json({
      success: true,
      count: appointments.length,
      appointments,
    });
  } catch (error) {
    console.error(
      "Get my appointments error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================================
// CANCEL APPOINTMENT
// =====================================================

export const cancelAppointment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    // Find appointment belonging
    // to logged-in patient
    const appointment =
      await Appointment.findOne({
        _id: id,
        patient: req.user.id,
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Only pending appointments
    // can be cancelled
    if (appointment.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          `Appointment cannot be cancelled because it is already ${appointment.status}`,
      });
    }

    // Cancel appointment
    appointment.status = "cancelled";

    await appointment.save();

    return res.status(200).json({
      success: true,
      message:
        "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error(
      "Cancel appointment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================================
// RESCHEDULE APPOINTMENT
// =====================================================

export const rescheduleAppointment = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    const {
      appointmentDate,
    } = req.body;

    // Check date
    if (!appointmentDate) {
      return res.status(400).json({
        success: false,
        message:
          "New appointment date is required",
      });
    }

    // Convert date
    const newDate =
      new Date(appointmentDate);

    // Validate date
    if (
      Number.isNaN(newDate.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid appointment date",
      });
    }

    // Date must be in future
    if (newDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message:
          "Appointment date must be in the future",
      });
    }

    // Find appointment
    const appointment =
      await Appointment.findOne({
        _id: id,
        patient: req.user.id,
      });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Cancelled/completed appointments
    // cannot be rescheduled
    if (
      appointment.status === "cancelled" ||
      appointment.status === "completed"
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Appointment cannot be rescheduled because it is ${appointment.status}`,
      });
    }

    // Update appointment date
    appointment.appointmentDate =
      newDate;

    await appointment.save();

    return res.status(200).json({
      success: true,
      message:
        "Appointment rescheduled successfully",
      appointment,
    });
  } catch (error) {
    console.error(
      "Reschedule appointment error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================================
// UPDATE APPOINTMENT STATUS
// =====================================================
// Doctor can change appointment status:
// pending
// confirmed
// cancelled
// completed
// =====================================================

export const updateAppointmentStatus = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { id } = req.params;

    const { status } = req.body;

    // Allowed statuses
    const allowedStatuses = [
      "pending",
      "confirmed",
      "cancelled",
      "completed",
    ];

    // Validate status
    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed values: pending, confirmed, cancelled, completed",
      });
    }

    // Find appointment
    const appointment =
      await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    // Update status
    appointment.status = status;

    await appointment.save();

    return res.status(200).json({
      success: true,
      message:
        `Appointment ${status} successfully`,
      appointment,
    });
  } catch (error) {
    console.error(
      "Update appointment status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};