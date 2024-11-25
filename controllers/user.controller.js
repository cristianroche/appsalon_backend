import Appointment from "../models/Appointment.js";

const getUserAppointments = async (req, res) => {
  const { user } = req.params;

  if (user !== req.user._id.toString() && req.user.role !== "admin") {
    return res.status(400).json({
      error: "Access denied.",
    });
  }

  try {
    const query = { date: { $gte: new Date() } };

    if (!req.user.admin) {
      query.user = user;
    }

    const userAppointments = await Appointment.find(query)
      .populate("services")
      .populate({ path: "user", select: "name email" })
      .sort({ date: 1, time: 1 });
    res.status(200).json(userAppointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { getUserAppointments };
