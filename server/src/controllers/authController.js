import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

import User from "../models/User.js";
import Category from "../models/Category.js"

const generateAccessandRefreshTokens = async (user) => {
  try {
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

export const registerUser = asyncHandler(async(req, res) => {
    
    const { fullName, email, password } = req?.body || {};
    const profileImageLocalUrl = req.file?.path;

    if ([fullName, email, password].some((field) => !field?.trim())) {
        throw new ApiError(400, "All fields are required");
    }

    const alreadyExists = await User.findOne({ email });
    
    if(alreadyExists){
        throw new ApiError(400, "Email already exists");
    }

    let profileImageUrl = "";

    if(profileImageLocalUrl){
        const uploadResponse = await uploadOnCloudinary(profileImageLocalUrl);

        if(!uploadResponse){
            throw new ApiError(500, "Image upload failed");
        }

        profileImageUrl = uploadResponse.secure_url;
    }

    const newUser = await User.create({
        fullName,
        email,
        password,
        profileImageUrl
    });

    const createdUser = await User.findById(newUser._id).select("_id fullName email profileImageUrl");

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering user");
    }

    // After user is created
    await Category.insertMany([
        { userId: createdUser._id, name: "Salary" },
        { userId: createdUser._id, name: "Freelance"},
        { userId: createdUser._id, name: "Business" },
        { userId: createdUser._id, name: "Transport" },
        { userId: createdUser._id, name: "Shopping" },
    ]);

    res.status(201).json(new ApiResponse(201, createdUser, "User registered Successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email && !password){
        throw new ApiError(400, "Email and password required");
    }

    const user = await User.findOne({ email });

    if(!user){
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.comparePassword(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessandRefreshTokens(user);
    
    const loggedInUser = await User.findById(user._id).select("_id fullName email profileImageUrl")

    const options = {
        httpOnly: true,
        secure: true
    };

    res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in Successfully"))

});

export const getUserInfo = asyncHandler(async (req, res) => {
    const userId = req?.user?.id;

    const user = await User.findById(userId).select("-password -refreshToken");

    if(!user){
        throw new ApiError(404, "User not found");
    }

    res.status(201).json(new ApiResponse(200, user, "User details fetched successfully"));
})

export const uploadProfileImage = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    if(!req.file){
        throw new ApiError(400, "Profile image required");
    }

    const user = await User.findById(userId);

    if(!user){
        throw new ApiError(404, "User not found");
    }
    
    const uploadResponse = await uploadOnCloudinary(req?.file.path);

    if(!uploadResponse){
        throw new ApiError(500, "Image upload failed");
    }
    user.profileImageUrl = uploadResponse.secure_url;

    await user.save();

    res.status(201).json(new ApiResponse(200, {
        profileImageUrl: user.profileImageUrl
    }, "Profile Image uploaded successfully"))

})

export const logoutUser = asyncHandler(async(req, res) => {
    const userId = req?.user?.id;

    const user = await User.findById(userId);

    if(!user){
        throw new ApiError(404, "User not found");
    }

    
    if(!user?.refreshToken){
        const options = {
            httpOnly: true,
            secure: true
        };
        
        res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User was already logged out"))
    }
    
    user.refreshToken = null;
    await user.save();

     const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User logged out successfullly"))
})