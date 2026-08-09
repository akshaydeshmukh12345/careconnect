import mongoose, { Document, Schema } from "mongoose";

export interface IAppointment extends Document {
  patient: mongoose.Types.ObjectId;
  doctor: mongoose.Types.ObjectId;
  appointmentDate: Date;
  reason?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    appointmentDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

const Appointment = mongoose.model<IAppointment>(
  "Appointment",
  appointmentSchema
);

export default Appointment;