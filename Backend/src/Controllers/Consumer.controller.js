import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Consumer } from "../models/Consumer.model.js";
import jwt from "jsonwebtoken"


const generateAccessAndRefereshTokens = async(userId) => {
    try {
        const user = await Consumer.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerConsumer = asyncHandler( async(req, res) => {
   
    const { fullName, email, phoneNumber } = req.body

    if(!fullName || !email || !phoneNumber) {
        throw new ApiError(400, "Please enter required fields")
    }

    const {password} = req.body

    if(!password) {
        throw new ApiError(400, "Please enter password")
    }

    const existingUser = await Consumer.findOne(
        {   
            $or: [{phoneNumber}, {email}, {password}]
        }
    )

    if(existingUser) {
        throw new ApiError(400, "User already exists")
    }

    const savedUser = await Consumer.save({
        fullName,
        email,
        phoneNumber,
        Cart,
        province,
        password
    })

    const registeredUser = await Consumer.findById(savedUser._id)

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


const loginConsumer = asyncHandler(async(req, res) => {
    const { email, password } = req.body

    if(!email || !password) {
        throw new ApiError(400, "Please enter all fields")
    }

    const isExistingConsumer = await Consumer.findOne(
        {
            $or: [{email}, {password}]
        }
    )
    if(!isExistingConsumer) {
        throw new ApiError(400, "User doesn't exist")
    }

    const isPasswordCorrect = await isExistingConsumer.isPasswordCorrect(password)
    
    if(!isPasswordCorrect){
        throw new ApiError(400, "Incorrect Password")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(isExistingConsumer._id)
    
    isExistingConsumer.refreshToken = refreshToken

    const loggedInConsumer = await Consumer.findById(isExistingConsumer._id).select("-password -refreshToken") 

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
                consumer: loggedInConsumer, accessToken, refreshToken
            },
            "Succesfully logged in !!"
        )
    )
})


const logoutConsumer = asyncHandler(async(req, res) => {

    await Consumer.findByIdAndUpdate(
        req.consumer._id,
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
    
        const user = await Consumer.findById(decodedToken?._id)
    
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

const getCurrentConsumer = asyncHandler(async(req, res) => {

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.consumer,
            "Successfully retrieved farmer details"
        )
    )

})


export {
    registerConsumer,
    loginConsumer,
    logoutConsumer,
    refreshAccessToken
}