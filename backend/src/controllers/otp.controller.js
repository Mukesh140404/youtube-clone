import { ApiError, ApiResponse, asyncHandler } from "../utils/index.js";
import Otp from "../models/otp.modals.js";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import { sendOTP } from "../lib/nodemailer.js";

const sendOtp = asyncHandler(async (req, res) => {

    const { email } = req.body;
    if (!email) throw new ApiError(400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User does not exist with this email");

    const otp = await sendOTP(email);
    //hash the otp
    const otpHash = await bcrypt.hash(otp, 10);
    const expireAt = new Date(Date.now() + 2 * 60 * 1000); //20 minutes from now

    const otpDoc = await Otp.create({
        email,
        expireAt,
        otpHash
    })

    if (!otpDoc) throw new ApiError(500, "Failed to create otp document");
    return res
        .status(200)
        .json(
            new ApiResponse(200, { success: true }, "OTP sent successfully")
        )

})

const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) throw new ApiError(400, "Email and OTP are required");

    const otpDoc = await Otp.findOne({ email }).sort({ createdAt: -1 });

    if (!otpDoc) throw new ApiError(404, "OTP not found for this email");

    const isOtpValid = await bcrypt.compare(otp, otpDoc.otpHash);

    if (!isOtpValid) throw new ApiError(400, "Invalid OTP");

    if (otpDoc.expireAt < new Date()) throw new ApiError(400, "OTP has expired");

    otpDoc.isVerified = true;
    await otpDoc.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, { success: true }, "OTP verified successfully")
        )
})

export {
    sendOtp, verifyOtp
}