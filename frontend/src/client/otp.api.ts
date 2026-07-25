import type { ResetPasswordFormData, SendOtpFormData, VerifyOtpFormData } from "@/types/otp.type"
import api from "./api"

export const sendOtpApi = async (sendOtpForm: SendOtpFormData) => {
    try {
        const res = await api.post("/otps/send", { email: sendOtpForm.email })
        return res.data
    } catch (error) {
        throw error
    }
}

export const verifyOtpApi = async (verifyOtpForm: VerifyOtpFormData) => {
    try {
        const res = await api.post("/otps/verify", { email: verifyOtpForm.email, otp: verifyOtpForm.otp })
        return res.data
    } catch (error) {
        throw error
    }
}

export const resetPasswordApi = async (resetPasswordForm: ResetPasswordFormData) => {
    try{
        const res = await api.post("/users/set-new-password", { email: resetPasswordForm.email, newPassword: resetPasswordForm.newPassword })
        return res.data
    }
    catch (error) {
        throw error
    }
}