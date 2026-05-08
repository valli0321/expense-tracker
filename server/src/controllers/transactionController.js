import ExcelJS from "exceljs";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import Category from "../models/Category.js";
import Transaction from "../models/Transaction.js";

export const addTransaction = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const { amount, categoryId, description, date, icon, type } = req.body;

    if(!userId){
        throw new ApiError(401, "Unauthorised");
    }

    if(!amount || !categoryId || !type){
        throw new ApiError(400, "Amount, type and category required");
    }

    if(amount <= 0) throw new ApiError(400, "Amount must be greater than 0");

    if(!["income", "expense"].includes(type)) throw new ApiError(400, `Invalid transaction type. "income" OR "expense" allowed`);

    // Validate category
    const category = await Category.findOne({
        _id: categoryId,
        userId,
    });

    if(!category){
        throw new ApiError(400, "Invalid Category");
    }

    const transaction = await Transaction.create({
        userId,
        amount,
        category: categoryId,
        type,
        description: description?.trim(),
        date,
        icon
    });

    res.status(201).json(new ApiResponse(200, transaction, "Transaction added"));
});

export const getAllTransactions = asyncHandler(async(req, res) => {
    const userId = req.user._id;

    if(!userId){
        throw new ApiError(401, "Unauthorised");
    }

    const {
        page = 1,
        limit = 10,
        type,
        category,
        startDate,
        endDate,
        sortBy = "date",
        sortOrder = "desc",
    } = req.query;

    const pageNumber = parseInt(page);
    const pageSize = parseInt(limit);
    const skip = (pageNumber - 1) * pageSize;

    const filter = { userId };

    if (category) filter.category = category;

    if(type) filter.type = type;

    if (startDate || endDate) {
        filter.date = {};

        if (startDate) {
            filter.date.$gte = new Date(startDate);
        }

        if (endDate) {
            filter.date.$lte = new Date(endDate);
        }
    }

    const sortOptions = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const [transactions, total] = await Promise.all([
        Transaction.find(filter)
        .populate("category", "name")
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize),

        Transaction.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                transactions,
                pagination: {
                    total,
                    page: pageNumber,
                    limit: pageSize,
                    totalPages,
                    hasNextPage: pageNumber < totalPages,
                    hasPrevPage: pageNumber > 1,
                },
            },
            "Transactions fetched successfully"
        )
    );
});

export const updateTransaction = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const { transactionId } = req.params;
    const { amount, icon, categoryId, description, date, type } = req.body;

    if(!userId) throw new ApiError(401, "Unauthorised");

    if(!transactionId) throw new ApiError(400, "Transaction ID required");

    const transaction = await Transaction.findById(transactionId);

    if(!transaction) throw new ApiError(404, "Transaction not found");

    if(categoryId){
        const category = await Category.findById(categoryId);

        if(!category) throw new ApiError(404, "Invalid Category");

        transaction.category = categoryId;
    }

    if(amount !== undefined){
        if(amount<=0) throw new ApiError(400, "Amount must be greater than 0");

        transaction.amount = amount;
    }

    if(type){
        if(!["income", "expense"].includes(type)){
            throw new ApiError(400, `Invalid transaction type. "income" OR "expense" allowed`);
        }

        transaction.type = type;
    }

    if(description !== undefined) transaction.description = description?.trim();

    if(date) transaction.date = date;
    
    if(icon !== undefined) transaction.icon = icon;

    await transaction.save();

    await transaction.populate("category", "name");

    res.status(201).json(new ApiResponse(200, transaction, "Transaction updated uccessfully"));
});

export const deleteTransaction = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const { transactionId } = req.params;

    if(!userId){
        throw new ApiError(401, "Unauthorised");
    };

    if(!transactionId){
        throw new ApiError(400, "Transaction ID required");
    }

    const transaction = await Transaction.findOne({
        _id: transactionId,
        userId
    });

    if(!transaction){
        throw new ApiError(404, "Transaction not found");
    }

    await transaction.deleteOne();

    res.status(201).json(new ApiResponse(200, null, "Transaction deleted successfully"));
});

export const downloadTransactionExcel = asyncHandler(async(req, res) => {
    const userId = req.user._id;

    const { type, startDate, endDate, category } = req.query;

    if(!userId){
        throw new ApiError(401, "Unauthorised");
    }

    const filter = { userId };

    if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
    }

    if (category) filter.category = category;

    if (type) filter.type = type;

    const transactions = await Transaction.find(filter)
        .populate("category", "name")
        .sort({ date: -1 });

    if (!transactions.length) {
        throw new ApiError(404, "No transactions found");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    worksheet.columns = [
        { header: "Date", key: "date", width: 15 },
        { header: "Type", key: "type", width: 12 },
        { header: "Category", key: "category", width: 20 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Description", key: "description", width: 25 },
        { header: "Created At", key: "createdAt", width: 30 },
    ];

    worksheet.getRow(1).font = { bold: true };

    transactions.forEach((transaction) => {
        worksheet.addRow({
            date: new Date(transaction.date).toLocaleDateString(),
            type: transaction?.type || "Uncategorised",
            category: transaction?.category?.name || "",
            amount: transaction.amount,
            description: transaction?.description || "",
            createdAt: new Date(transaction.createdAt).toLocaleString(),
        })
    });

    const totalIncome = transactions
        .filter(t => t?.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t?.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    worksheet.addRow({});
    worksheet.addRow({ category: "Total Income", amount: totalIncome });
    worksheet.addRow({ category: "Total Expense", amount: totalExpense });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=transaction-report.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
});

export const getTransactionById = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const { transactionId } = req.params;

    if(!userId) throw new ApiError(401, "Unauthorised");

    if(!transactionId) throw new ApiError(400, "Transaction ID required");

    const transaction = await Transaction.findById(transactionId);

    if(!transaction) throw new ApiError(404, "Transaction not found");

    await transaction.populate("category", "name");

    res.status(201).json(new ApiResponse(200, transaction, "Transaction fetched successfully"));
});