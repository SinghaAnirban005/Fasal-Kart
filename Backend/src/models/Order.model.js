import mongoose from "mongoose"
import { Schema } from "mongoose"

const orderSchema = new Schema({
    
    item: {
        type: Schema.Types.ObjectId,
        ref: "Product"
    },

    buyer: {
        type: Schema.Types.ObjectId,
        ref: "Consumer"
    },

    seller: {
        type: Schema.Types.ObjectId,
        ref: "Producer"
    },

    quantity: {
        type: Number,
        required: true,
        minValue: 0
    },

    totalPrice: {
        type: Number,
        required: true,
        minValue: 0,
    },

    status: {
        type: String, 
        required: true,
        trim: true,
        index: true 
    },

    deliveryAddress: {
        type: String,
        required: true,
    }
    
},
{
    timestamps: true,
}
)

export const Order = mongoose.model('Order', orderSchema)