import mongoose from "mongoose"
import { Schema } from "mongoose"

const consumerSchema = new Schema({
    
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    password: {
        type: String,
        required: [true, "Please enter password"],
        trim: true,
        unique: true,
        minLength: 6,
    },

    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        index: true
    },

    refreshToken: {
        type: String,
    },

    Cart: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ],

    phoneNumber: {
        type: Number,
        required: true,
        index: true,
        unique: true
    },

    itemsBought: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],

    Transactions: [
        {
            type: Schema.Types.ObjectId,
            ref: "Transaction"
        }
    ]

}, 
{
    timestamps: true
}
)


export const Consumer = mongoose.model("Consumer", consumerSchema)