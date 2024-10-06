import mongoose from "mongoose";
import { Producer } from "../models/Producer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async(userId) => {
    try {
        const user = await Producer.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerFarmer = asyncHandler( async(req, res) => {
    const { fullName, phoneNumber, aadhaarNumber } = req.body

    // intial checks ...
    if(!fullName || !aadhaarNumber || !phoneNumber) {
        throw new ApiError(404, "Please enter required fields")
    }

    const { province, Language } = req.body
    // next check
    if(!province || !Language) {
        throw new ApiError(404, "Please enter required fields")
    }
    // final check 
    const { password } = req.body
    if(!password) {
        throw new ApiError(404, "Please set password")
    }

    const existingUser = await Producer.findOne(
        {   
            $or: [{phoneNumber}, {aadhaarNumber}, {password}]
        }
    )

    if(existingUser) {
        throw new ApiError(400, "User already exists")
    }

    const savedUser = await Producer.save({
        fullName,
        aadhaarNumber,
        phoneNumber,
        Language,
        province,
        password
    })

    const registeredUser = await Producer.findById(savedUser._id)

    if(!registeredUser) {
        throw new ApiError(400, "some error occured while trying to register")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            registeredUser,
            "You have succesfully registered"
        )
    )
})

const loginFarmer = asyncHandler(async(req, res) => {
    const { aadhaarNumber, password } = req.body

    if(!aadhaarNumber || !password) {
        throw new ApiError(400, "Please enter all fields")
    }

    const isExistingFarmer = await Producer.findOne(
        {
            $or: [{aadhaarNumber}, {password}]
        }
    )
    if(!isExistingFarmer) {
        throw new ApiError(400, "User doesn't exist")
    }

    const isPasswordCorrect = await isExistingFarmer.isPasswordCorrect(password)
    
    if(!isPasswordCorrect){
        throw new ApiError(400, "Incorrect Password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(isExistingFarmer._id)
    
    isExistingFarmer.refreshToken = refreshToken

    const loggedInFarmer = await Producer.findById(isExistingFarmer._id).select("-password -refreshToken") 

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                farmer: loggedInFarmer, accessToken, refreshToken
            },
            "Succesfully logged in !!"
        )
    )
})


const logoutFarmer = asyncHandler(async(req, res) => {

    await Producer.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await Producer.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        } 
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")   
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})

const getCurrentFarmer = asyncHandler(async(req, res) => {

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "Successfully retrieved farmer details"
        )
    )

})

export {
    registerFarmer,
    loginFarmer,
    logoutFarmer,
    refreshAccessToken,
    getCurrentFarmer
}