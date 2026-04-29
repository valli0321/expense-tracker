import express from "express";
import { getUserInfo, loginUser, logoutUser, registerUser, uploadProfileImage } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";
import upload from "../middleware/uploadMiddleware.js";


const router = express.Router();

router.get("/get-user", authMiddleware, getUserInfo);

router.post("/register",upload.single("profileImage"), registerUser);
router.post("/login", loginUser);
router.post("/logout", authMiddleware, logoutUser);
router.post("/upload-image",authMiddleware, upload.single("profileImage"), uploadProfileImage)


export default router;