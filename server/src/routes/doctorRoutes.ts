import { Router } from "express";
import { getDoctors, createDoctor } from "../controllers/doctorController";

const router = Router();

router.get("/", getDoctors);
router.post("/", createDoctor);

export default router;