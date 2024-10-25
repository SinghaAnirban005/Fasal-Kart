import mongoose from "mongoose"
import { Schema } from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const producerSchema = new Schema({
    
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    province: {
            type: String,
        },

    phoneNumber: {
        type: Number,
        required: true,
        index: true,
        unique: true
    },

    Language: {
            type: String,
            required: true,
            default: "English",
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
    // But for now we shall keep it common for all 
    // Reels: [
    //     {
    //         type: Schema.Types.ObjectId,
    //         ref: "Video",
    //     }
    // ],

    // aadhaarNumber: {
    //     type: Number,
    //     unique: true,
    //     trim: true,
    //     required: true,
    //     index: true,
    // },

    // landDetails: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Land"
    // },

    // cardDetails: {
    //     type: Schema.Types.ObjectId,
    //     ref: "KisanCard"
    // },

    // verifiedStatus: {
    //     type: Boolean,
    //     default: false
    // },

    rating: [{
        type: Schema.Types.ObjectId,
        ref: 'FRating'       
    }],

    password: {
        type: String,
        trim: true,
        required: true,
        minLength: 6,
    },
    
}, 
{
    timestamps: true
})

producerSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

producerSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

producerSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            phoneNumber: this.phoneNumber
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

producerSchema.methods.generateRefreshToken = function(){
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


export const Producer = mongoose.model("Producer", producerSchema)