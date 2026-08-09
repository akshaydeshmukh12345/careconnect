import { Router } from "express";
import { protect, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

router.get("/profile", protect, (req: AuthRequest, res) => {
  res.json({
    success: true,
    message: "Protected profile route accessed successfully",
    user: req.user,
  });
});

export default router;