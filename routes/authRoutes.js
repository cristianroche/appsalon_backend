import express from "express";
import {
  registerAccount,
  verifyAccount,
  login,
  forgotPassword,
  verifyPasswordResetToken,
  updatePassword,
  user,
  admin,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
// public routes
router.post("/register", registerAccount);
router.get("/verify/:token", verifyAccount);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

router
  .route("/forgot-password/:token")
  .get(verifyPasswordResetToken)
  .post(updatePassword);
// private routes - only accessible with token
router.get("/user", authMiddleware, user);
router.get("/admin", authMiddleware, admin);

export default router;
