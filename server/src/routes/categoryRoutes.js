import express from "express";

import { authMiddleware } from "../middleware/auth.js";
import { createCategpry, getCategories } from "../controllers/categoryController.js";

const router = express.Router();

router.post("/add-category", authMiddleware, createCategpry);

router.get("/get-categories", authMiddleware, getCategories);

export default router;