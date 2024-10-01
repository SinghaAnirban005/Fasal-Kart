import mongoose from "mongoose"
import { Schema } from "mongoose"

const kisanCardSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Producer'
    },

    cardId: {
        type: Number,
        required: true,
        trim: true,
        unique: true,
    },
    // should be a number but need to confirm the length of the KCC num
    cardNumber: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    issueDate: {
        type: Date,
        required: true
    },

    expiryDate: {
        type: Date,
        required: true,
    }
},
{
    timestamps: true,
}
)

export const kisanCard = mongoose.model('kisanCard', kisanCardSchema)