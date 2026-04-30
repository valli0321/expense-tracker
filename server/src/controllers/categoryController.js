import Category from "../models/Category.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCategpry = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const { name, type } = req.body;

    if(!userId){
        throw new ApiError(401, "Unauthorised");
    }
    
    if(!name || !type){
        throw new ApiError(400, "Category name and type required");
    }
    const normalizedName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();
    
    const existing = await Category.findOne({
        userId,
        name,
        type,
    });

    if (existing) {
        throw new ApiError(400, "Category already exists");
    }

    const category = await Category.create({
        userId,
        name: normalizedName,
        type
    });

    res.status(201).json(new ApiResponse(200, category, "Category created"));

});

export const getCategories = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const { type } = req.query;

    if(!userId){
        throw new ApiError(401, "Unauthorised");
    };

    if(!type) {
        throw new ApiError(400, "type required")
    }

    const categories = await Category.find({ userId, type }).sort({ name: 1});

    res.status(201).json(new ApiResponse(200, categories, "Categories fetched"));

});