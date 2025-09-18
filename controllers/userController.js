import User from "../models/User.js";

// Get own profile
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
};

// Update profile
export const updateProfile = async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
  res.json(user);
};

// Opposite gender profiles
export const getOppositeGenderUsers = async (req, res) => {
  const currentUser = await User.findById(req.user.id);
  const oppositeGender = currentUser.gender === "Male" ? "Female" : "Male";

  const users = await User.find({ gender: oppositeGender, isVerified: true, isBlocked: false })
    .select("name age location profilePic");

  res.json(users);
};
