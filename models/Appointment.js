import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  services: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
  ],
  date: {
    type: Date,
  },
  time: {
    type: String,
  },
  totalAmount: {
    type: Number,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

export default Appointment;
