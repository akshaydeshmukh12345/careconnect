import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db";

import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import aiRoutes from "./routes/aiRoutes";
import adminRoutes from "./routes/adminRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// =========================
// CORS
// =========================

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// =========================
// BODY PARSER
// =========================

app.use(express.json());

// =========================
// ROUTES
// =========================

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/doctors", doctorRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/ai", aiRoutes);

app.use("/api/admin", adminRoutes);

// =========================
// TEST ROUTE
// =========================

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CareConnect API is running",
  });
});

// =========================
// START SERVER
// =========================

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `CareConnect server running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();