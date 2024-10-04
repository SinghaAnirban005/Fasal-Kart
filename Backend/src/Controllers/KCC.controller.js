import mongoose from "mongoose";
import { kisanCard } from "../models/KisanCard.model.js"
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"

const submitKCC = asyncHandler(async(req, res) => {
    // Two possibilities :: 
    // 1. farmers upload photo of their KCC
    // 2. farmers fill necessaryy details from their Card

    const { name, address, bankName, bankBranch, accountNumber, issueDate, expiryDate} = req.body

    if(!name) {
        throw new ApiError(404, 'Please enter name')
    }
    if(!address) {
        throw new ApiError(404, 'Please enter name')
    }
    if(!bankName) {
        throw new ApiError(404, 'Please enter name')
    }
    if(!bankBranch) {
        throw new ApiError(404, 'Please enter name')
    }
    if(!accountNumber) {
        throw new ApiError(404, 'Please enter name')
    }
    if(!issueDate) {
        throw new ApiError(404, 'Please enter name')
    }
    if(!expiryDate) {
        throw new ApiError(404, 'Please enter name')
    }
    
    const existingCard = await kisanCard.find({
        accountNumber: accountNumber
    })

    if(existingCard) {
        throw new ApiError(400, "This account number is already registered")
    }

    // if card has expired then we shall not accept them as farmers
    let ltsDate = new Date()
    const validity = ltsDate - expiryDate

    if(validity > 0) {
        throw new Error(400, "Please use a valid KCC")
    }

    // final
    const savedKCC = await kisanCard.save(
        {
            name,
            address,
            bankName,
            bankBranch,
            accountNumber,
            issueDate,
            expiryDate
        }
    )

    const registeredKCC = await kisanCard.findById(savedKCC._id)
    if(!registeredKCC) {
        throw new ApiError(400, "Some error occured while registering KCC")
    }

    return res
        .status(200)    
        .json(
            new ApiResponse(
                200,
                registeredKCC,
                "KCC has been submitted and you will be verified soon !!"
            )
        )

})



export {
    submitKCC
}