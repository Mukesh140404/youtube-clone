import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true
        },
        otpHash: {
            type: String,
            required: true
        },
        expireAt: {
            type: Date,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

export const Otp = mongoose.model("Otp", otpSchema)