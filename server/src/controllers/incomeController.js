import ExcelJS from "exceljs";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import Category from "../models/Category.js";
import Income from "../models/Income.js";

export const addIncome = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const { amount, categoryId, description, date, icon } = req.body;

    if(!userId){
        throw new ApiError(401, "Unauthorised");
    }

    if(!amount || !categoryId){
        throw new ApiError(400, "Amount and category required");
    }

    // Validate category
    const category = await Category.findOne({
        _id: categoryId,
        userId,
        type: "income"
    });

    if(!category){
        throw new ApiError(400, "Invalid Category");
    }

    const income = await Income.create({
        userId,
        amount,
        category: categoryId,
        description,
        date,
        icon
    });

    res.status(201).json(new ApiResponse(200, income, "Income added"));
});

export const getAllIncome = asyncHandler(async(req, res) => {
    const userId = req.user._id;

    if(!userId){
        throw new ApiError(401, "Unauthorised");
    }

    const {
        page = 1,
        limit = 10,
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

    if (category) {
        filter.category = category;
    }

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

    const [incomes, total] = await Promise.all([
        Income.find(filter)
        .populate("category", "name type")
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize),

        Income.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / pageSize);

    res.status(200).json(
        new ApiResponse(
            200,
            {
                incomes,
                pagination: {
                    total,
                    page: pageNumber,
                    limit: pageSize,
                    totalPages,
                    hasNextPage: pageNumber < totalPages,
                    hasPrevPage: pageNumber > 1,
                },
            },
            "Incomes fetched successfully"
        )
    );
});

export const deleteIncome = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const { incomeId } = req.params;

    if(!userId){
        throw new ApiError(401, "Unauthorised");
    };

    if(!incomeId){
        throw new ApiError(400, "Income ID required");
    }

    const income = await Income.findOne({
        _id: incomeId,
        userId
    });

    if(!income){
        throw new ApiError(404, "Income not found");
    }

    await income.deleteOne();

    res.status(201).json(new ApiResponse(200, null, "Income deleted successfully"));
});

export const downloadIncomeExcel = asyncHandler(async(req, res) => {
    const userId = req.user._id;

    const { startDate, endDate, category } = req.query;

    if(!userId){
        throw new ApiError(401, "Unauthorised");
    }

    const filter = { userId };

    if(category){
        filter.category = category;
    }

    if(startDate || endDate){
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
    }

    const incomes = await Income.find(filter)
        .populate("category", "name")
        .sort({ date: -1});
    
    if(!incomes.length){
        throw new ApiError(404, "No incomes data found");
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Income");

    worksheet.columns = [
        { header: "Date", key: "date", width: 15 },
        { header: "Amount", key: "amount", width: 15 },
        { header: "Category", key: "category", width: 20 },
        { header: "Description", key: "description", width: 25 },
        { header: "Created At", key: "createdAt", width: 30 },
    ];

    worksheet.getRow(1).font = { bold: true };

    incomes.forEach((income) => {
        worksheet.addRow({
            date: new Date(income.date).toLocaleDateString(),
            amount: income.amount,
            category: income?.category?.name || "",
            description: income?.description || "",
            createdAt: new Date(income.createdAt).toLocaleString(),
        })
    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
        "Content-Disposition",
        `attachment; filename=income-report.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();
});