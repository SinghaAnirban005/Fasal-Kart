import mongoose from "mongoose"
import { Schema } from "mongoose"

const transactionSchema = new Schema({
    paidBy: {
        type: Schema.Types.ObjectId,
        ref: "Consumer"
    },

    paidTo: {
        type: Schema.Types.ObjectId,
        ref: "Producer"
    },

    quantity: {
        type: Number,
        minValue: 1
    }

    amount: {
        type: Number,
        required: true,
        minValue: 0
    },

    paymentMethod: [
        {
            type: String,
            required: true
        }
    ],

    paymentStatus: {
        type: String,
        required: true,
    },

    transactionDate: {
        type: Date
    },

    taxInfo: {
        type: String,
    },

    transactionType: {
        type: String,
        required: true
    }

},
{
    timestamps: true,
}
)

export const Transaction = mongoose.model('Transaction', transactionSchema)