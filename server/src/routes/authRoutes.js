import express from "express";
import { getUserInfo, loginUser, registerUser } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/auth.js";


const router = express.Router();

router.get("/get-user", authMiddleware, getUserInfo);

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;