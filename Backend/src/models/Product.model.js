import mongoose from "mongoose"
import { Schema } from "mongoose"

const productSchema = new Schema({
    
    name: {
        type: String,
        required: true,
        trim: true.
        index: true,
    },

    Owner: {
        type: Schema.Types.ObjectId,
        ref: "Producer",
    },
    // TODO :: Necessary in order to ease out sorting of producrts on consumer's POV but farmer's POV would give slight challenges
    Category: {
        type: String,
        trim: true,
    },

    orderedBy: [
        {
            type: Schema.Types.ObjectId,
            ref: "Consumer"
        }
    ],

    rating: {
        type: Schema.Types.ObjectId,
        ref: "Rating"
    },

    Price: {
        type: Number, 
        required: true,
        trim: true,
        minValue: 0
    },
    
    Quantity: {
        type: Number,
        required: true,
        minValue: 0,
    },

    quantitySold: {
        type: Number,
        required: true,
        minValue: 0,
    },

    marketPrice: {
        type: Number,
        required: true,
        minValue: 0,
        index: true
    }
    
},
{
    timestamps: true,
}
)

export const Product = mongoose.model('Product', productSchema)