import { Response } from "express";
import User from "../models/User";
import { AuthRequest } from "../middleware/authMiddleware";
import { askGemini } from "../services/geminiService";

export const askAI = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid message.",
      });
    }

    const user = await User.findById(req.user.id).select(
    "healthProfile"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const healthProfile = {
  age: user.healthProfile?.age,
  biologicalSex: user.healthProfile?.biologicalSex,
  height: user.healthProfile?.height,
  weight: user.healthProfile?.weight,
  activityLevel: user.healthProfile?.activityLevel,
  medicalConditions: user.healthProfile?.medicalConditions,
};

    const reply = await askGemini(
      message,
      healthProfile
    );

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
  console.error("Gemini API error:", error);

  if (error instanceof Error) {
    console.error("Gemini error message:", error.message);
  }

    return res.status(500).json({
      success: false,
      message: "AI service is currently unavailable.",
    });
  }
};