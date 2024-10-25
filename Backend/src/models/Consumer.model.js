import mongoose from "mongoose"
import { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const consumerSchema = new Schema({
    
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    username: {
        type: String,
        required: true,
        unique: true,
        minLength: 6,
        maxLength: 12
    },

    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6,
    },

    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        index: true
    },

    profilePic: {
        type: String,
        required: true
    },

    refreshToken: {
        type: String,
    },

    province: {
        type: String,
        required: true,
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

consumerSchema.pre("save", async function(next) {
    if(!this.isModified("password")) {
        return next()
    }

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

consumerSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

consumerSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            phoneNumber: this.phoneNumber
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


consumerSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id, 
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const Consumer = mongoose.model("Consumer", consumerSchema)