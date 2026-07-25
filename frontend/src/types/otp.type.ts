export type SendOtpFormData = {
  email: string;
};
export type VerifyOtpFormData = {
  email: string;
  otp: string;
};
export type ResetPasswordFormData = {
  email: string;
  newPassword: string;
};