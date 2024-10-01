import mongoose from "mongoose";
import { Schema } from "mongoose"

const videoSchema = new Schema({
    
    videoFile: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },

    title: {
        type: String,
        required: true,
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    duration: {
        type: Number,
        required: true,
        minValue: 0,
        maxValue: 60 // in seconds
    },

    views: {
        type: Number,
        required: true
    }

}, {
    timestamps: true,
})

export const Video = mongoose.model('Video', videoSchema)