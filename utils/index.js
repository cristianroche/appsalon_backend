import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { format } from "date-fns";

const validateObjectId = (id, res) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
};

const handleNotFound = (message, res) => {
  res.status(404).json({ message });
};

const uniqueId = () =>
  Date.now().toString(32) + Math.random().toString(32).substring(2);

const generateJWT = (user) => {
  const token = jwt.sign(
    {
      _id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );

  return token;
};

const formatDate = (date) => format(new Date(date), "MM/dd/yyyy");

export { validateObjectId, handleNotFound, uniqueId, generateJWT, formatDate };
