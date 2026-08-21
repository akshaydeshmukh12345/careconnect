import { Response } from "express";

import User from "../models/User";
import Doctor from "../models/Doctor";
import Appointment from "../models/Appointment";

import { AuthRequest } from "../middleware/authMiddleware";

export const getAdminStats = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    // Make sure user is logged in
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Count patients
    const patients = await User.countDocuments({
      role: "patient",
    });

    // Count doctors
    const doctors = await Doctor.countDocuments();

    // Count appointments
    const appointments = await Appointment.countDocuments();

    // Get unique doctor specializations
    const specializations = await Doctor.distinct(
      "specialization"
    );

    return res.status(200).json({
      success: true,
      stats: {
        patients,
        doctors,
        appointments,
        categories: specializations.length,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load admin statistics.",
    });
  }
};