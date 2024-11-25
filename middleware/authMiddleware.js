import User from "../models/User.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // set user without password, token, verified, and __v fields
      const user = await User.findById(decoded._id).select(
        "-password -verified -token -__v"
      );

      req.user = user;

      next();
    } catch (error) {
      res.status(403).json({ message: "Invalid token" });
    }
  } else {
    res.status(403).json({ message: "Invalid or non-existent token" });
  }
};

export default authMiddleware;
