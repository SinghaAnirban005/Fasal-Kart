import mongoose from "mongoose"
import { Schema } from "mongoose"

const producerSchema = new Schema({
    
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

    province: [
        {
            type: String,
        }
    ],

    phoneNumber: {
        type: Number,
        required: true,
        index: true,
        unique: true
    },

    Language: {
            type: [String],
            required: true,
            default: ["English"],
    },

    Stock: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product",
        }
    ],

    refreshToken: {
        type: String,
    },

    // Considering the case that each farmer would get reels based on their location 
    Reels: [
        {
            type: Schema.Types.ObjectId,
            ref: "",
        }
    ],

    aadhaarNumber: {
        type: Number,
        unique: true,
        trim: true,
        required: true,
        index: true,
        minLength: 12,
        maxLength: 12
    },

    landDetails: {
        type: Schema.Types.ObjectId,
        ref: "Land"
    },

    cardDetails: {
        type: Schema.Types.ObjectId,
        ref: "KisanCard"
    }
    
}, 
{
    timestamps: true
})


export const Producer = mongoose.model("Producer", producerSchema)