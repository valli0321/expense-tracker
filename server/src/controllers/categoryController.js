import mongoose from "mongoose";
import Category from "../models/Category.js";
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createCategpry = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const { name } = req.body;

    if(!userId){
        throw new ApiError(401, "Unauthorised");
    }
    
    if(!name){
        throw new ApiError(400, "Category name required");
    }
    const normalizedName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();
    
    const existing = await Category.findOne({
        userId,
        name: normalizedName,
    });

    if (existing) {
        throw new ApiError(400, "Category already exists");
    }

    const category = await Category.create({
        userId,
        name: normalizedName,
    });

    res.status(201).json(new ApiResponse(200, category, "Category created"));

});

export const getCategories = asyncHandler(async(req, res) => {
    const userId = req.user._id;

    if(!userId){
        throw new ApiError(401, "Unauthorised");
    };

    const categories = await Category.find({ userId }).sort({ name: 1});

    res.status(201).json(new ApiResponse(200, categories, "Categories fetched"));

});

export const updateCategory = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const { categoryId } = req.params;
    const { name } = req.body;
    const normalizedName = name.trim().charAt(0).toUpperCase() + name.trim().slice(1).toLowerCase();

    if(!userId){
        throw new ApiError(401, "Unauthorised");
    }

    if(!categoryId){
        throw new ApiError(400, "Category ID required");
    }
    
    if(!name){
        throw new ApiError(400, "Category name required");
    }

    const category = await Category.findOne({
        _id: categoryId,
        name: normalizedName,
        userId,
    });

    if(!category){
        throw new ApiError(404, "Category not found");
    }

    const existing = await Category.findOne({
        userId,
        name: normalizedName,
        _id: { $ne: categoryId },
    });

    if(existing){
        throw new ApiError(400, "Category already exists");
    }

    category.name = normalizedName;

    await category.save();

    res.status(201).json(new ApiResponse(200, category, "Category updated successfully"));
});

export const deleteCategory = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const { categoryId } = req.params;

    if(!userId) throw new ApiError(401, "Unauthorised");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const category = await Category.findById(categoryId).session(session);
    
        if(!category){
            throw new ApiError(404, "Category not found");
        }
    
        await Transaction.updateMany(
            { category: categoryId },
            { $set: { category: null }},
            { session }
        );

        await Category.findByIdAndDelete(categoryId, { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(new ApiResponse(200, null, "Category deleted and transactions updated")) 
        
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
})