import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";

const getVideos = asyncHandler(async(req, res) => {
    try {
        const {page = 1, limit = 10} = req.query

        const videos = await Video.find()
                            .sort({views: 1}) 
                            .skip((page - 1) * limit)
                            .limit(parseInt(limit, 10))
        
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videos,
                "Fetched Reels"
            )
        )

    } catch (error) {
        throw new ApiError(500, "ServerError ::" + error?.message)
    }
})

export {
    getVideos
}