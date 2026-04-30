import express from "express";

import { authMiddleware } from "../middleware/auth.js";
import { addIncome, deleteIncome, downloadIncomeExcel, getAllIncome } from "../controllers/incomeController.js";

const router = express.Router();

router.post("/add-income", authMiddleware, addIncome);

router.get("/get-all-income", authMiddleware, getAllIncome);
router.get("/download-excel", authMiddleware, downloadIncomeExcel);

router.delete("/:incomeId", authMiddleware, deleteIncome);

export default router;