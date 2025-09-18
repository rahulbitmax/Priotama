import express from "express";
import { getProfile, updateProfile, getOppositeGenderUsers } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/opposite-gender", protect, getOppositeGenderUsers);

export default router;
