import mongoose, { Document, Schema } from "mongoose";

export interface IDoctor extends Document {
  // Optional because imported Habitatt doctors may not have
  // a CareConnect login account yet.
  user?: mongoose.Types.ObjectId;

  name: string;

  // Main category:
  // Dietitian, Nutritionist, Dermatologist, etc.
  category?: string;

  specialization: string;

  experience: number;

  qualification: string;

  // Additional information from doctor profiles
  languages?: string;

  email?: string;

  phone?: string;

  consultationFee: number;

  available: boolean;

  // Profile photo
  profileImage?: string;

  createdAt: Date;

  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    // =========================================
    // CONNECTED CARECONNECT LOGIN ACCOUNT
    // =========================================
    // Optional because imported doctors don't
    // necessarily have a CareConnect login.
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      sparse: true,
    },

    // =========================================
    // DOCTOR NAME
    // =========================================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================================
    // CATEGORY
    // =========================================
    category: {
      type: String,
      trim: true,
      default: "Healthcare Professional",
    },

    // =========================================
    // SPECIALIZATION
    // =========================================
    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================================
    // EXPERIENCE
    // =========================================
    experience: {
      type: Number,
      min: 0,
      default: 0,
    },

    // =========================================
    // QUALIFICATION
    // =========================================
    qualification: {
      type: String,
      required: true,
      trim: true,
    },

    // =========================================
    // LANGUAGES
    // =========================================
    languages: {
      type: String,
      trim: true,
    },

    // =========================================
    // EMAIL
    // =========================================
    // Optional because source profiles may not
    // provide an email address.
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    // =========================================
    // PHONE
    // =========================================
    phone: {
      type: String,
      trim: true,
    },

    // =========================================
    // CONSULTATION FEE
    // =========================================
    consultationFee: {
      type: Number,
      min: 0,
      default: 0,
    },

    // =========================================
    // AVAILABILITY
    // =========================================
    available: {
      type: Boolean,
      default: true,
    },

    // =========================================
    // PROFILE IMAGE
    // =========================================
    profileImage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model<IDoctor>(
  "Doctor",
  doctorSchema
);

export default Doctor;