import mongoose from "mongoose"
import { Schema } from "mongoose"

const landSchema = new Schema({
    
    owner: {
        type: Schema.Types.ObjectId,
        ref: "Producer"
    },

    landArea: {
        type: Number,
        required: true,
        trim: true,
        minValue: 0,
    },

    landLocation: {
        type: String,
        required: true,
        trim: true,
    },
    // classify as either agricultural or non-agricultral land
    landType: {
        type: String,
        enum: ['Agricultural', 'Non-Agricultural'],
        required: true,
        default: "Agricultural" // Need to think more on this
    }

    landDcouments: {
        type: String // we shall upload cloudinary url
        required: true
    }

},
{
    timestamps: true,
}
)

export const Land = mongoose.model('Land', landSchema)