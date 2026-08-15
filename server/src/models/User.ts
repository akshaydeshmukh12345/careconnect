import mongoose, { Document, Schema } from "mongoose";

// =========================
// TYPES
// =========================

export type BiologicalSex =
  | "male"
  | "female"
  | "other"
  | "prefer_not_to_say";

export type ActivityLevel =
  | "mostly_sitting"
  | "often_standing"
  | "regularly_active"
  | "physically_intense";

// =========================
// USER INTERFACE
// =========================

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "patient" | "doctor" | "admin";

  // =========================
  // HEALTH PROFILE
  // =========================

  healthProfile?: {
    age?: number;
    biologicalSex?: BiologicalSex;
    height?: number;
    weight?: number;
    activityLevel?: ActivityLevel;
    medicalConditions?: string[];
  };

  createdAt: Date;
  updatedAt: Date;
}

// =========================
// USER SCHEMA
// =========================

const userSchema = new Schema<IUser>(
  {
    // =========================
    // BASIC USER INFORMATION
    // =========================

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    phone: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient",
    },

    // =========================
    // HEALTH PROFILE
    // =========================

    healthProfile: {
      age: {
        type: Number,
        min: 1,
        max: 120,
      },

      biologicalSex: {
        type: String,
        enum: [
          "male",
          "female",
          "other",
          "prefer_not_to_say",
        ],
      },

      // Height in centimeters
      height: {
        type: Number,
        min: 30,
        max: 300,
      },

      // Weight in kilograms
      weight: {
        type: Number,
        min: 1,
        max: 500,
      },

      activityLevel: {
        type: String,
        enum: [
          "mostly_sitting",
          "often_standing",
          "regularly_active",
          "physically_intense",
        ],
      },

      medicalConditions: {
        type: [String],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

// =========================
// MODEL
// =========================

const User = mongoose.model<IUser>("User", userSchema);

export default User;