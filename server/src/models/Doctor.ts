import mongoose, { Document, Schema } from "mongoose";

export interface IDoctor extends Document {
  name: string;
  specialization: string;
  experience: number;
  qualification: string;
  email: string;
  phone?: string;
  consultationFee: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<IDoctor>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: Number,
      required: true,
      min: 0,
    },

    qualification: {
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

    phone: {
      type: String,
      trim: true,
    },

    consultationFee: {
      type: Number,
      required: true,
      min: 0,
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Doctor = mongoose.model<IDoctor>("Doctor", doctorSchema);

export default Doctor;