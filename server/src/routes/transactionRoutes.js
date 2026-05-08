import express from "express";

import { authMiddleware } from "../middleware/auth.js";
import { addTransaction, deleteTransaction, downloadTransactionExcel, getAllTransactions, getTransactionById, updateTransaction } from "../controllers/transactionController.js";

const router = express.Router();

router.post("/add", authMiddleware, addTransaction);

router.put("/:transactionId", authMiddleware, updateTransaction);

router.get("/get-transactions", authMiddleware, getAllTransactions);
router.get("/download-excel", authMiddleware, downloadTransactionExcel);
router.get("/:transactionId", authMiddleware, getTransactionById);

router.delete("/:transactionId", authMiddleware, deleteTransaction);

export default router;