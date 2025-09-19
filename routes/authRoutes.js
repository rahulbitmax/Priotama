import express from "express";
import { registerUser, verifyOtp, loginUser } from "../controllers/authController.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/register", upload.single("profilePic"), registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginUser);


export default router;
