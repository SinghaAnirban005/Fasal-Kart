import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/Product.model.js";
import { Producer } from "../models/Producer.model.js";
import mongoose from "mongoose";

const rateProduct = asyncHandler(async(req, res) => {
    try {
        const consumerID = req.consumer._id
        const productID = req.params?.pid

        if(!productID) {
            throw new ApiError(400, "Product id cannot be fetched")
        }

        const product = await Product.findById(productID).populate('rating')

        const { value } = req.body

        if(!value) {
            throw new ApiError(400, "Enter valid rate")
        }   

        if(!product) {
            throw new ApiError(404, "Invalid product id ")
        }

        if(value > 5) {
            throw new ApiError(400, "Enter valid value")
        }

        else{
            product.rating?.rate += value
            const userID = mongoose.Types.ObjectId(consumerID)
            product.rating?.ratedBy.push(userID)

            await product.save()
        }

        // better to take input from consumer of rating 
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                product?.rating?.rate,
                "Succesfully rated product"
            )
        )

    } catch (error) {
        throw new ApiError(500, error?.message | "Failed to rate")
    }
})

const rateFarmer = asyncHandler(async(req, res) => {
    try {

        const consumerID = req.consumer._id
        const farmerID = req.params?.pid

        if(!productID) {
            throw new ApiError(400, "Product id cannot be fetched")
        }

        const farmer = await Producer.findById(farmerID).populate('rating')

        const { value } = req.body

        if(!value) {
            throw new ApiError(400, "Enter valid rate")
        }   

        if(!farmer) {
            throw new ApiError(404, "Invalid farmer id ")
        }

        if(value > 5) {
            throw new ApiError(400, "Enter valid value")
        }

        else{
           farmer.rating?.rate += value
           const userId = mongoose.Types.ObjectId(consumerID)
           farmer.rating?.ratedBy.push(userId)

           await farmer.save()
        }

        // better to take input from consumer of rating 
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                farmer.rating?.rate,
                "Succesfully rated product"
            )
        )
    } catch (error) {
        throw new ApiError(500, error?.message)
    }
})

const getProductRate = asyncHandler(async(req, res) => {
    try {
        const productID = req.params?.pid

        if(!productID) {
            throw new ApiError(400, "Product ID does not exist !!")
        }

        const product = await Product.findById(productID).populate('rating')
        if(!product) {
            throw new ApiError(400, "product does not exist ")
        }

        let rateSum = 0;
        product.rating?.forEach((pr) => {
            rateSum += pr.rate
        })


        return rateSum / product.rating?.length
    } catch (error) {
        throw new ApiError(500, "Failed to get Product rate")
    }
})

const getFarmerRate = asyncHandler(async(req, res) => {
    try {
        const farmerId = req.params?.pid

        if(!farmerId) {
            throw new ApiError(400, "Farmer ID does not exist !!")
        }

        const farmer = await Producer.findById(farmerId).populate('rating')
        if(!product) {
            throw new ApiError(400, "product does not exist ")
        }

        let rateSum = 0;
        farmer.rating?.forEach((pr) => {
            rateSum += pr.rate
        })


        return rateSum / farmer.rating?.length
    } catch (error) {
        throw new ApiError(500, "Failed to get Farmer rate")
    }
})

export {
    rateProduct,
    rateFarmer,
    getProductRate,
    getFarmerRate
}