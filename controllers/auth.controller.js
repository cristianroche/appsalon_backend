import {
  sendEmailVerification,
  sendEmailForgotPassword,
} from "../emails/authEmailService.js";
import User from "../models/User.js";
import { generateJWT, handleNotFound, uniqueId } from "../utils/index.js";

const MIN_PASSWORD_LENGTH = process.env.MIN_PASSWORD_LENGTH || 8;

const registerAccount = async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ message: "Name, Password and Email are required" });
    return;
  }

  const userExists = await User.findOne({
    email,
  });

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  if (password.trim().length < MIN_PASSWORD_LENGTH) {
    res.status(400).json({
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    });
    return;
  }

  try {
    const newUser = await User({ email, password, name });
    const { token } = await newUser.save();
    // Send email verification
    sendEmailVerification({ name, email, token });

    res
      .status(201)
      .json({ message: "User created successfully, check your email" });
  } catch (error) {
    res.status(500).send("Failed to create user");
    console.error(error);
  }
};

const verifyAccount = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ token });

  if (!user) {
    res.status(401).json({ message: "Invalid Token" });
    return;
  }

  if (user.verified) {
    res.status(400).json({ message: "User already verified" });
    return;
  }

  try {
    user.verified = true;
    user.token = "";
    await user.save();

    res.status(200).json({ message: "User verified successfully" });
  } catch (error) {
    res.status(500).send("Failed to verify user");
    console.error(error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Email and Password are required" });
    return;
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    handleNotFound("User not found", res);
    return;
  }

  if (!user.verified) {
    res.status(401).json({ message: "Your account has not been verified yet" });
    return;
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    res.status(401).json({ message: "Invalid Password" });
    return;
  }

  const token = generateJWT(user);

  res.status(200).json({ token });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  const user = await User.findOne({
    email,
  });

  if (!user) {
    handleNotFound("User not found", res);
    return;
  }

  try {
    user.token = uniqueId();

    await user.save();

    await sendEmailForgotPassword({
      name: user.name,
      email: user.email,
      token: user.token,
    });

    res
      .status(200)
      .json({ message: "We have sent an email with instructions" });
  } catch (error) {
    res.status(500).send("Failed to send email");
    console.error(error);
  }
};

const verifyPasswordResetToken = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ token });

  if (!user) {
    handleNotFound("Invalid Token", res);
    return;
  }

  res.status(200).json({ message: "Token is valid" });
};

const updatePassword = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    res.status(400).json({ message: "Password is required" });
    return;
  }

  if (password.trim().length < MIN_PASSWORD_LENGTH) {
    res.status(400).json({
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    });
    return;
  }

  const { token } = req.params;

  const user = await User.findOne({ token });

  if (!user) {
    handleNotFound("Invalid Token", res);
    return;
  }

  try {
    user.password = password;
    user.token = "";

    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).send("Failed to update password");
    console.error(error);
  }
};

const user = async (req, res) => {
  const { user } = req;
  res.status(200).json({ user });
};

const admin = async (req, res) => {
  const { user } = req;

  if (!user.admin) {
    res.status(403).json({ message: "Unauthorized Action" });
    return;
  }

  res.status(200).json({ user });
};

export {
  registerAccount,
  verifyAccount,
  login,
  forgotPassword,
  verifyPasswordResetToken,
  updatePassword,
  user,
  admin,
};
