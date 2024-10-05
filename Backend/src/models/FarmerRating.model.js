import mongoose from "mongoose"
import { Schema } from "mongoose"

const fratingSchema = new Schema({

    rate: {
        type: Number,
        required: true,
        minValue: 0,
        maxValue: 5,
        default: 0,
    },

    ratedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: "Consumer"
        }
    ],
    
},
{
    timestamps: true,
}
)

export const FRating = mongoose.model('FRating', fratingSchema)