import { Router } from "express";
import { askAI } from "../controllers/aiController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post(
  "/ask",
  protect,
  askAI
);

export default router;