import { Request, Response } from "express";
import Doctor from "../models/Doctor";

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

    const doctor = await Doctor.create({
      name,
      specialization,
      experience,
      qualification,
      email,
      phone,
      consultationFee,
      available,
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