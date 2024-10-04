import mongoose from "mongoose"
import { Schema } from "mongoose"

const kisanCardSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    address: {
        type: String,
        required: true,
        trim: true,
    },
    
    bankName: {
        type: String,
        required: true,
        trim: true
    },

    bankBranch: {
        type: String,
        required: true,
        trim: true
    },

    accountNumber: {
        type: Number,
        minLength: 11,
        maxLength: 16,
        unique: true,
        index: true,
    },

    issueDate: {
        type: Date,
        required: true,
        trim: true,
    },

    expiryDate: {
        type: Date,
        required: true,
        trim: true
    },

    verificationStatus: {
        type: Boolean,
        default: false,
    }

},
{
    timestamps: true,
}
)

export const kisanCard = mongoose.model('kisanCard', kisanCardSchema)