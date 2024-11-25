import express from "express";
import {
  createAppointment,
  getAppointmentsByDate,
  getAppointmentById,
  updateAppointment,
  deleteAppointmentById,
} from "../controllers/appointment.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
// private routes - only authenticated users can access
router
  .route("/")
  .post(authMiddleware, createAppointment)
  .get(authMiddleware, getAppointmentsByDate);

router
  .route("/:id")
  .get(authMiddleware, getAppointmentById)
  .put(authMiddleware, updateAppointment)
  .delete(authMiddleware, deleteAppointmentById);

export default router;
