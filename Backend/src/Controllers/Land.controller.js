import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Land } from "../models/Land.model.js";

const submitLandDetails = asyncHandler(async(req, res) => {
   try {
    const { landArea, landLocation, landType } = req.body
    const farmerId = req.user._id

    if(!landArea || !landLocation || !landType) {
        throw new ApiError(400, "Please enter the required fields")
    }

    const image = req.file?.landDocuments[0]?.path

    if(!image) {
        throw new ApiError(400, "Land Documents are required")
    }
    
    const uploadedImage = await uploadOnCloudinary(image)

    if(!uploadedImage) {
        throw new ApiError(400, "Land Documents are required")
    }
    
    // Here , we need to decide the way to verify the image with the details provided 
    // then we can provide the response 
    // For now we explicitly define verification as true
    let status = true

    const landDetails = await Land.save({
        owner: farmerId,
        landArea,
        landLocation,
        landType,
        landDocuments: uploadedImage.url,
        verifiedStatus: status
    })

    const land = await Land.findById(landDetails._id).select("-landDocuments")

    if(!land) {
        throw new ApiError(400, "Failed to process land Details")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            land,
            "Succesfully submitted land details"
        )
    )
   } catch (error) {
        console.log(error.message)      
        throw new ApiError(500, "Something went wrong !!")
   }
})



export {
    submitLandDetails
}