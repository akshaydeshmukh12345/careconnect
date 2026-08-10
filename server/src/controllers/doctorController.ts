import { Request, Response } from "express";
import Doctor from "../models/Doctor";
import Appointment from "../models/Appointment";
import { AuthRequest } from "../middleware/authMiddleware";

// =========================
// GET ALL DOCTORS
// =========================

export const getDoctors = async (
  _req: Request,
  res: Response
) => {
  try {
    const doctors = await Doctor.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (error) {
    console.error("Get doctors error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =========================
// CREATE DOCTOR
// =========================

export const createDoctor = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      specialization,
      experience,
      qualification,
      email,
      phone,
      consultationFee,
      available,
    } = req.body;

    if (
      !name ||
      !specialization ||
      experience === undefined ||
      !qualification ||
      !email ||
      consultationFee === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, specialization, experience, qualification, email and consultation fee are required",
      });
    }

    const existingDoctor = await Doctor.findOne({
      email: email.toLowerCase(),
    });

    if (existingDoctor) {
      return res.status(409).json({
        success: false,
        message: "Doctor already exists with this email",
      });
    }

    const doctor = await Doctor.create({
      name,
      specialization,
      experience,
      qualification,
      email: email.toLowerCase(),
      phone,
      consultationFee,
      available:
        available !== undefined ? available : true,
    });

    return res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      doctor,
    });
  } catch (error) {
    console.error("Create doctor error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =========================
// DOCTOR DASHBOARD
// =========================

export const getDoctorDashboard = async (
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

    // Only doctors can access this dashboard
    if (req.user.role !== "doctor") {
      return res.status(403).json({
        success: false,
        message: "Doctor access required",
      });
    }

    // Find doctor using logged-in doctor's email
    const doctor = await Doctor.findOne({
      email: req.user.email.toLowerCase(),
    });

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor profile not found",
      });
    }

    // Get appointments belonging to this doctor
    const appointments = await Appointment.find({
      doctor: doctor._id,
    })
      .populate(
        "patient",
        "name email phone"
      )
      .sort({
        appointmentDate: 1,
      });

    // Calculate statistics
    const totalAppointments =
      appointments.length;

    const pendingAppointments =
      appointments.filter(
        (appointment) =>
          appointment.status === "pending"
      ).length;

    const confirmedAppointments =
      appointments.filter(
        (appointment) =>
          appointment.status === "confirmed"
      ).length;

    const completedAppointments =
      appointments.filter(
        (appointment) =>
          appointment.status === "completed"
      ).length;

    const cancelledAppointments =
      appointments.filter(
        (appointment) =>
          appointment.status === "cancelled"
      ).length;

    return res.status(200).json({
      success: true,

      doctor: {
        id: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
        experience: doctor.experience,
        qualification: doctor.qualification,
        email: doctor.email,
        phone: doctor.phone,
        consultationFee:
          doctor.consultationFee,
        available: doctor.available,
      },

      statistics: {
        total: totalAppointments,
        pending: pendingAppointments,
        confirmed: confirmedAppointments,
        completed: completedAppointments,
        cancelled: cancelledAppointments,
      },

      appointments,
    });
  } catch (error) {
    console.error(
      "Get doctor dashboard error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Server error while loading doctor dashboard",
    });
  }
};