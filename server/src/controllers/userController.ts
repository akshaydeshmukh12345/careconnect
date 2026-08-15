import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";

// =========================
// GET PROFILE
// =========================
export const getProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        healthProfile: user.healthProfile,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =========================
// UPDATE PROFILE
// =========================
export const updateProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { name, phone } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name.trim();
    user.phone = phone?.trim() || "";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        healthProfile: user.healthProfile,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while updating profile",
    });
  }
};

// =========================
// GET HEALTH PROFILE
// =========================
export const getHealthProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const user = await User.findById(req.user.id).select(
      "healthProfile"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      healthProfile: user.healthProfile,
    });
  } catch (error) {
    console.error("Get health profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =========================
// UPDATE HEALTH PROFILE
// =========================
export const updateHealthProfile = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      age,
      biologicalSex,
      height,
      weight,
      activityLevel,
      medicalConditions,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.healthProfile = {
      age,
      biologicalSex,
      height,
      weight,
      activityLevel,
      medicalConditions: Array.isArray(
        medicalConditions
      )
        ? medicalConditions
        : [],
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Health profile saved successfully",
      healthProfile: user.healthProfile,
    });
  } catch (error) {
    console.error(
      "Update health profile error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error while saving health profile",
    });
  }
};