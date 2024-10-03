import mongoose from "mongoose";
import { Producer } from "../models/Producer.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Producer } from "../models/Producer.model.js";


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
            $or: [{phoneNumber}, {aadhaarNumber}]
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

export {
    registerFarmer
}