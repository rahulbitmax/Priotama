import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    location: { type: String },
    gender: { type: String, enum: ["Male", "Female"], required: true },
    age: { type: Number, required: true },
    profilePic: { type: String }, // store URL or filename
    instaId: { type: String },
    hobby: { type: String },

    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
