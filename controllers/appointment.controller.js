import { parse, formatISO, startOfDay, endOfDay, isValid } from "date-fns";
import {
  formatDate,
  handleNotFound,
  validateObjectId,
} from "../utils/index.js";

import Appointment from "../models/Appointment.js";
import {
  sendEmailNewAppointment,
  sendEmailUpdatedAppointment,
  sendEmailCancelledAppointment,
} from "../emails/appointmentEmailService.js";

const createAppointment = async (req, res) => {
  const { date, time, totalAmount, services } = req.body;

  if (!date || !time || !totalAmount || services.length === 0) {
    res.status(400).json({
      message: "date, time, totalAmount and services are required",
    });
    return;
  }

  const appointment = req.body;
  appointment.user = req.user._id.toString();

  try {
    const newAppointment = await Appointment(appointment);
    const result = await newAppointment.save();

    // send email to admin
    sendEmailNewAppointment({
      date: formatDate(result.date),
      time: result.time,
    });

    res.status(201).json({ message: "Appointment created successfully" });
  } catch (error) {
    res.status(500).send("Failed to create appointment");
    console.error(error);
  }
};

const getAppointmentsByDate = async (req, res) => {
  const { date } = req.query;

  if (!date) {
    res.status(400).json({ message: "date is required" });
    return;
  }

  // parse date to ISO format
  const newDate = parse(date, "MM/dd/yyyy", new Date());

  if (!isValid(new Date(newDate))) {
    res.status(400).json({ message: "Invalid date" });
    return;
  }

  const isoDate = formatISO(newDate);

  try {
    const appointments = await Appointment.find({
      date: {
        $gte: startOfDay(new Date(isoDate)),
        $lte: endOfDay(new Date(isoDate)),
      },
      user: req.user._id,
    }).select("time");
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).send("Failed to get appointments");
    console.error(error);
  }
};

const getAppointmentById = async (req, res) => {
  const { id } = req.params;

  validateObjectId(id, res);

  try {
    const appointment = await Appointment.findById(id).populate("services");

    if (!appointment) {
      handleNotFound("Appointment not found", res);
      return;
    }

    if (appointment.user.toString() !== req.user._id.toString()) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).send("Failed to get appointment");
    console.error(error);
  }
};

const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { date, time, totalAmount, services } = req.body;

  validateObjectId(id, res);

  if (!date || !time || !totalAmount || services.length === 0) {
    res.status(400).json({
      message: "date, time, totalAmount and services are required",
    });
    return;
  }

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    handleNotFound("Appointment not found", res);
    return;
  }

  if (appointment.user.toString() !== req.user._id.toString()) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  appointment.date = date;
  appointment.time = time;
  appointment.totalAmount = totalAmount;
  appointment.services = services;

  try {
    const result = await appointment.save();

    sendEmailUpdatedAppointment({
      date: formatDate(result.date),
      time: result.time,
    });

    res.status(200).json({ message: "Appointment updated successfully" });
  } catch (error) {
    res.status(500).send("Failed to update appointment");
    console.error(error);
  }
};

const deleteAppointmentById = async (req, res) => {
  const { id } = req.params;

  validateObjectId(id, res);

  const appointment = await Appointment.findById(id);

  if (!appointment) {
    handleNotFound("Appointment not found", res);
    return;
  }

  if (appointment.user.toString() !== req.user._id.toString()) {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }

  try {
    const result = await appointment.deleteOne();

    sendEmailCancelledAppointment({
      date: formatDate(appointment.date),
      time: appointment.time,
    });

    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).send("Failed to delete appointment");
    console.error(error);
  }
};

export {
  createAppointment,
  getAppointmentsByDate,
  getAppointmentById,
  updateAppointment,
  deleteAppointmentById,
};
