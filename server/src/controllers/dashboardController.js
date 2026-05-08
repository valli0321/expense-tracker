import mongoose from "mongoose";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

import Transaction from "../models/Transaction.js";
import Category from "../models/Category.js";

export const getDashboardData = asyncHandler(async(req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const { startDate, endDate } = req.query;

    if(!userId){
        throw new ApiError(401, "Unauthorised");
    }

    const matchStage = { userId };

    if (startDate || endDate) {
        matchStage.date = {};
        if (startDate) matchStage.date.$gte = new Date(startDate);
        if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    const dashboardData = await Transaction.aggregate([
        { $match: matchStage },

        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
            },
        },
        { 
            $unwind: {
                path: "$category",
                preserveNullAndEmptyArrays: true,
            } 
        },

        {
            $facet: {
                summary: [
                {
                    $group: {
                        _id: "$type",
                        total: { $sum: "$amount" },
                    },
                },
                ],

                monthly: [
                    {
                        $group: {
                            _id: {
                                year: { $year: "$date" },
                                month: { $month: "$date" },
                                type: "$type",
                                category: {
                                    $ifNull: ["$category.name", "Uncategorized"],
                                },
                            },
                            total: { $sum: "$amount" },
                        },
                    },
                    {
                        $group: {
                            _id: {
                                year: "$_id.year",
                                month: "$_id.month",
                            },
                            data: {
                                $push: {
                                    type: "$_id.type",
                                    total: "$total",
                                    category: "$_id.category"
                                },
                            },
                        },
                    },
                    { $sort: { "_id.year": 1, "_id.month": 1 } },
                ],

                financialOverview: [
                    {
                        $group: {
                            _id: {
                                category: {
                                    $ifNull: ["$category.name", "Uncategorized"],
                                },
                                type: "$type",
                            },
                            value: { $sum: "$amount" },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            name: "$_id.category",
                            type: "$_id.type",
                            value: 1,
                        },
                    },
                    { $sort: { value: -1 } },
                ],

                recent: [
                    { $sort: { date: -1 } },
                    { $limit: 5 },
                ],
            },
        },
    ]);

    const data = dashboardData[0];

    let totalIncome = 0;
    let totalExpense = 0;

    data.summary.forEach((item) => {
        if (item._id === "income") totalIncome = item.total;
        if (item._id === "expense") totalExpense = item.total;
    });

    const balance = totalIncome - totalExpense;

    res.json(
        new ApiResponse(
        200,
        {
            summary: {
                totalIncome,
                totalExpense,
                balance,
            },

            monthly: data.monthly,

            charts: {
                financialOverview: data.financialOverview.map((i) => ({
                    name: i.name,
                    value: i.value,
                    type: i.type,
                }))
            },

            recentTransactions: data.recent,
        },
        "Dashboard data fetched"
        )
    );
})
