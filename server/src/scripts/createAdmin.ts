import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db";
import User from "../models/User";

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = "admin@careconnect.com";
    const adminPassword = "ChangeThisAdminPassword123!";

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(
      adminPassword,
      10
    );

    await User.create({
      name: "CareConnect Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("================================");
    console.log("Admin account created successfully");
    console.log("Email:", adminEmail);
    console.log("Password:", adminPassword);
    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("Failed to create admin:", error);
    process.exit(1);
  }
};

createAdmin();