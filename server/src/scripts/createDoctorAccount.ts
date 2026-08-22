import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import connectDB from "../config/db";
import User from "../models/User";
import Doctor from "../models/Doctor";

dotenv.config();

const createDoctorAccount = async () => {
  try {
    await connectDB();

    // Find existing doctor
    const doctor = await Doctor.findOne({
      name: "Dr. Rahul Sharma",
    });

    if (!doctor) {
      console.log("Doctor Dr. Rahul Sharma not found.");
      await mongoose.connection.close();
      process.exit(1);
    }

    console.log("Doctor found:", doctor.name);
    console.log("Doctor ID:", doctor._id.toString());

    // Make sure doctor has an email
    if (!doctor.email) {
      console.log("WARNING: Doctor email is missing.");
      await mongoose.connection.close();
      process.exit(1);
    }

    // Store email after validation
    const doctorEmail = doctor.email;

    // Check whether a User already exists with doctor's email
    let user = await User.findOne({
      email: doctorEmail.toLowerCase(),
    });

    // If user doesn't exist, create doctor user
    if (!user) {
      const password = "Doctor@123";

      const hashedPassword = await bcrypt.hash(
        password,
        10
      );

      user = await User.create({
        name: doctor.name,
        email: doctorEmail.toLowerCase(),
        password: hashedPassword,
        phone: doctor.phone,
        role: "doctor",
      });

      console.log("Doctor user account created.");
      console.log("Email:", user.email);
      console.log("Password:", password);
    } else {
      console.log("User already exists:", user.email);

      // Make sure this account is a doctor
      if (user.role !== "doctor") {
        user.role = "doctor";
        await user.save();

        console.log(
          "Existing user role changed to doctor."
        );
      }
    }

    // Link Doctor document to User
    doctor.user = user._id;

    await doctor.save();

    console.log("=================================");
    console.log("Doctor account linked successfully!");
    console.log("=================================");

    console.log("Doctor:", doctor.name);
    console.log("Doctor ID:", doctor._id.toString());
    console.log("User ID:", user._id.toString());
    console.log("Email:", user.email);

    console.log("=================================");
    console.log("Login credentials for local testing:");
    console.log("Email:", user.email);
    console.log("Password: Doctor@123");
    console.log("=================================");

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      "Create doctor account error:",
      error
    );

    await mongoose.connection.close();

    process.exit(1);
  }
};

createDoctorAccount();