import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Typo from "typo-js";
import { Producer } from "../models/Producer.model.js";
import { Product } from "../models/Product.model.js";

import { uploadOnCloudinary } from "../utils/cloudinary.js"

const addProduct = asyncHandler(async(req, res) => {
    const dictionary = new Typo('en_US');
    try {
        const { name, price, Quantity, Category } = req.body

        if(!name || !price || !Quantity || !Category)  {
            throw new ApiError(400, "Please enter all fields")
        }

        const suggestions = dictionary.suggest(name);

        const avatar = req.file?.path

        let pic = null

        if(avatar){
            pic = await uploadOnCloudinary(avatar)
        }

        const existingProduct = await Product.findOne(
            {
                name: suggestions[0] || name
            }
        )

        if(existingProduct) {
            throw new ApiError(400, 'Product already exists')
        }

        const product = await Product.create(
            {
                name: suggestions[0] || name,
                Owner: req.user._id,
                Category,
                Price: price,
                Quantity,
                image: pic?.url
            }
        )

        const farmer = await Producer.findById(req.user._id).select('-password -refreshToken')

        if(!farmer) {
            throw new ApiError(400, 'Account does not exist')
        }

        farmer.Stock.push(product._id)
        await farmer.save()

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                product,
                "Succesfully added Product !!"
            )
        )
        
    } catch (error) {
        throw new ApiError(500 , "Server error :: " + error?.message)
    }
})

const getProducts = asyncHandler(async(req, res) => {
    try {
        const farmer = await Producer.findById(req.user._id).select('-password -refreshToken')
        .populate('Stock')

        if(!farmer){
            throw new ApiError(400, 'Account does not exist')
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    farmer.Stock,
                    "Fetched products of farmer's"
                )
            )
    } catch (error) {
        throw new ApiError(500, "Server error ::" + error?.message)
    }
})


const deleteProduct = asyncHandler(async(req, res) => {
    try {

        const { productId } = req.params;   // Will change to body param since products are listed
        
        const product = await Product.findById(productId);
        if (!product) {
            throw new ApiError(404, "Product not found");
        }
        
        const producer = await Producer.findById(req.user._id);
        if (!producer) {
            throw new ApiError(404, "Producer account does not exist");
        }

        producer.Stock = producer.Stock.filter(stockItem => stockItem.toString() !== productId);
        await producer.save();

        await Product.findByIdAndDelete(productId);

        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                producer,
                "Deleted the product from Stock"
            )
        )
    } catch (error) {
        throw new ApiError(500, "Server error ::" + error?.message)
    }
})

const addStock = asyncHandler(async(req, res) => {
    try {
        const { productId } = req.params

        const { newQuantity } = req.body

        if(!newQuantity) {
            throw new ApiError(400, "Invalid data")
        }

        const updatedStock = await Product.findByIdAndUpdate(
            productId,
            {
                Quantity: newQuantity
            },
            {
                new: true
            }
        )

        if(!updatedStock){
            throw new ApiError(400, "Failed to update stock")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedStock,
                    "Updated stock"
                )
            )
    } catch (error) {
        throw new ApiError(500, "Server Error ::" + error?.message)
    }
})

const updatePrice = asyncHandler(async(req, res) => {
    try {
        const { productId } = req.params

        const { newPrice } = req.body

        if(!newPrice) {
            throw new ApiError(400, "Invalid data")
        }

        const updatedStock = await Product.findByIdAndUpdate(
            productId,
            {
                Price: newPrice
            },
            {
                new: true
            }
        )

        if(!updatedStock){
            throw new ApiError(400, "Failed to update price")
        }

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    updatedStock,
                    "Updated Price"
                )
            )
    } catch (error) {
        throw new ApiError(500, "Server Error ::" + error?.message)
    }
})



export {
    addProduct,
    getProducts,
    deleteProduct,
    addStock,
    updatePrice
}