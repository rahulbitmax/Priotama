import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const sendOtp = async (email, otp) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP code is: ${otp}`,
    });

    console.log("📧 OTP sent successfully to", email);
  } catch (error) {
    console.error("❌ Email send error:", error.message);
    throw new Error("Email could not be sent");
  }
};
