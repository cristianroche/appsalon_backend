import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";

import { db } from "./config/db.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// enable json parsing on request body
app.use(express.json());

// Connect to MongoDB
db();

// Confgure CORS
const whiteList = process.env.ALLOWED_ORIGINS.split(",");

if (process.argv[2] === "--postman") {
  whiteList.push(undefined);
}

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

app.use("/api/services", serviceRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/appointments", appointmentRoutes);

app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.info(colors.blue(`Server is running on http://localhost:${PORT}`));
});
