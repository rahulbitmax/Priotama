import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import { sendOtp } from "../utils/sendOtp.js";

// ---------------- REGISTER ----------------
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, gender, age, location, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle profilePic from multer (req.file)
    let profilePicPath = null;
    if (req.file) {
      profilePicPath = req.file.path; // stored path from uploadMiddleware
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      gender,
      age,
      location,
      profilePic: profilePicPath,
      password: hashedPassword,
    });

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);

    await Otp.create({
      userId: user._id,
      otpHash,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // expires in 5 min
    });

    // Send OTP via email/SMS
    await sendOtp(email, otp);

    res.status(201).json({
      message: "OTP sent for verification",
      userId: user._id,
      profilePic: profilePicPath,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- VERIFY OTP ----------------
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otpRecord = await Otp.findOne({ userId: user._id });
    if (!otpRecord) return res.status(400).json({ message: "OTP expired or not found" });

    const isMatch = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid OTP" });

    user.isVerified = true;
    await user.save();

    await Otp.deleteMany({ userId: user._id });

    res.json({ message: "Account Created Successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ---------------- LOGIN ----------------
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) return res.status(403).json({ message: "User not verified" });
    if (user.isBlocked) return res.status(403).json({ message: "User blocked" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        age: user.age,
        location: user.location,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
