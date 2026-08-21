import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import connectDB from "../config/db";
import Doctor from "../models/Doctor";

dotenv.config();

interface HabitattDoctor {
  name: string;
  category?: string;
  specialization: string;
  qualification: string;
  languages?: string;
  experience?: number;
  consultationFee?: number;
  available?: boolean;
  profileImage?: string;
}

const seedDoctors = async () => {
  try {
    // =========================================
    // CONNECT TO MONGODB
    // =========================================

    await connectDB();

    // =========================================
    // READ DOCTORS JSON
    // =========================================

    const doctorsPath = path.join(
      process.cwd(),
      "data",
      "doctors.json"
    );

    if (!fs.existsSync(doctorsPath)) {
      throw new Error(
        `doctors.json not found at: ${doctorsPath}`
      );
    }

    const doctors: HabitattDoctor[] = JSON.parse(
      fs.readFileSync(doctorsPath, "utf-8")
    );

    console.log(
      `Found ${doctors.length} doctors in doctors.json`
    );

    // =========================================
    // SYNC DATABASE INDEXES
    // =========================================
    // Important because we changed user/email
    // fields to optional + sparse.
    
    await Doctor.syncIndexes();

    // =========================================
    // IMPORT DOCTORS
    // =========================================

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const doctor of doctors) {
      if (!doctor.name || !doctor.specialization) {
        console.log(
          "Skipping invalid doctor:",
          doctor
        );

        skipped++;
        continue;
      }

      const result = await Doctor.updateOne(
        {
          name: doctor.name,
        },
        {
          $set: {
            category:
              doctor.category ||
              "Healthcare Professional",

            specialization:
              doctor.specialization,

            experience:
              doctor.experience ?? 0,

            qualification:
              doctor.qualification ||
              "Not provided",

            languages:
              doctor.languages || "",

            consultationFee:
              doctor.consultationFee ?? 0,

            available:
              doctor.available ?? true,

            profileImage:
              doctor.profileImage || "",
          },

          $setOnInsert: {
            name: doctor.name,
          },
        },
        {
          upsert: true,
        }
      );

      if (result.upsertedCount > 0) {
        inserted++;
      } else if (result.modifiedCount > 0) {
        updated++;
      }
    }

    // =========================================
    // FINAL RESULT
    // =========================================

    console.log("");
    console.log("================================");
    console.log("Habitatt Doctor Import Complete");
    console.log("================================");

    console.log(`Total source doctors : ${doctors.length}`);
    console.log(`New doctors          : ${inserted}`);
    console.log(`Updated doctors      : ${updated}`);
    console.log(`Skipped doctors      : ${skipped}`);

    console.log("================================");

    process.exit(0);
  } catch (error) {
    console.error("");
    console.error("================================");
    console.error("Doctor import failed");
    console.error("================================");

    console.error(error);

    process.exit(1);
  }
};

seedDoctors();