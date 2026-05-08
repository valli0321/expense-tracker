import express from "express";

import { authMiddleware } from "../middleware/auth.js";
import { updateCategory, getCategories, deleteCategory, createCategpry } from "../controllers/categoryController.js";

const router = express.Router();

router.post("/add-category", authMiddleware, createCategpry);

router.get("/get-categories", authMiddleware, getCategories);

router.put("/:categoryId", authMiddleware, updateCategory);
router.delete("/:categoryId", authMiddleware, deleteCategory);

export default router;