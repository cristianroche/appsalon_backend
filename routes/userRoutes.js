import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getUserAppointments } from "../controllers/user.controller.js";

const router = express.Router();
// private routes - only accessible with token
router.route("/:user/appointments").get(authMiddleware, getUserAppointments);

export default router;
