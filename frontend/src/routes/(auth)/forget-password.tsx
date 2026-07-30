import { resetPasswordApi, sendOtpApi, verifyOtpApi } from '@/client/otp.api'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

export const Route = createFileRoute('/(auth)/forget-password')({
  component: ForgotPassword,
})

// ---------- Zod Schemas ----------
const emailSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
})

const otpSchema = z.object({
  otp: z
    .string()
    .min(1, 'OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only digits'),
})

const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type Step = 'email' | 'otp' | 'reset'

function ForgotPassword() {
  const navigate = useNavigate()

  const [step, setStep] = useState<Step>('email')

  // shared state across steps
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ---------- Step 1: Email ----------

const {mutate:SendOtpMutation,isPending:isSendOtpPending} = useMutation({
  mutationFn: sendOtpApi,
  onSuccess: () => {
    toast.success('OTP sent successfully. Please check your email.')
    setStep('otp')
  },
  onError:() => {
    toast.error('Failed to send OTP. Please try again.')
  },
})

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    const result = emailSchema.safeParse({ email })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    try {
      SendOtpMutation({email})
    } catch (err: any) {
      setApiError(err?.response?.data?.message || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ---------- Step 2: OTP ----------

  const {mutate:VerifyOtpMutation,isPending:isVerifyOtpPending} = useMutation({
    mutationFn: verifyOtpApi,
    onSuccess: () => {
      toast.success('OTP verified successfully.')
      setStep('reset')
    },
    onError: () => {
      toast.error('Invalid OTP. Please try again.')
    }
  })

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    const result = otpSchema.safeParse({ otp })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})

    setLoading(true)
    try {
      VerifyOtpMutation({ email, otp })
    } catch (err: any) {
      setApiError(err?.response?.data?.message || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ---------- Step 3: Reset Password ----------

  const {mutate:resetPasswordMutation,isPending:isResetPasswordPending} = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: () => {
      toast.success('Password reset successfully. Please log in with your new password.')
      navigate({ to: '/Login' })
    },
    onError: () => {
      toast.error('Failed to reset password. Please try again.')
    }
  })

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setApiError('')

    const result = resetPasswordSchema.safeParse({ newPassword, confirmPassword })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0] as string] = issue.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})

    setLoading(true)
    try {
      resetPasswordMutation({ email, newPassword })
    } catch (err: any) {
      setApiError(err?.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen overflow-hidden relative bg-gray-50 flex flex-col md:flex-row">
      <div className="w-full h-screen">
        <img
          src="/login-banner.jpeg"
          alt="Forgot Password Banner"
          className="h-screen w-full object-cover"
        />
      </div>
      <div
        className="
          w-9/10 md:w-3/7
          h-auto md:h-screen
          absolute rounded-xl md:rounded-none
          left-1/2 -translate-x-1/2
          md:left-auto md:right-0 md:translate-x-0
          top-1/2 -translate-y-1/2
          md:top-0 md:translate-y-0
          flex items-center justify-center
          overflow-y-auto
          p-4
          bg-white/15
        "
      >
        <div className="w-full max-w-lg">
          {step === 'email' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-black mb-2">Forgot Password</h1>
                <p className="text-white/70">Enter your email to receive an OTP</p>
              </div>

              {apiError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Email Address</label>
                  <input
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black focus:border-black/30 focus:ring-2 focus:ring-black/80 outline-none transition-all bg-transparent text-black"
                    placeholder="hc@h.com"
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSendOtpPending}
                  className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSendOtpPending ? 'Sending OTP...' : 'Send OTP on Email'}
                </button>
              </form>

              <p className="mt-8 text-center text-black text-sm">
                Remembered your password?{' '}
                <Link to="/Login" className="text-rose-600 hover:text-rose-700 font-semibold transition-colors">
                  Sign in
                </Link>
              </p>
            </>
          )}

          {step === 'otp' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-black mb-2">Verify OTP</h1>
                <p className="text-white/70">
                  Enter the 6 digit code sent to <span className="font-medium">{email}</span>
                </p>
              </div>

              {apiError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">OTP</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-4 py-3 rounded-xl border border-black focus:border-black/30 focus:ring-2 focus:ring-black/80 outline-none transition-all bg-transparent text-black tracking-[0.5em] text-center"
                    placeholder="000000"
                  />
                  {errors.otp && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.otp}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifyOtpPending}
                  className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isVerifyOtpPending ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>

              <p className="mt-8 text-center text-black text-sm">
                Didn&apos;t get the code?{' '}
                <button
                  type="button"
                  onClick={() => setStep('email')}
                  className="text-rose-600 hover:text-rose-700 font-semibold transition-colors"
                >
                  Change email
                </button>
              </p>
            </>
          )}

          {step === 'reset' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-black mb-2">Set New Password</h1>
                <p className="text-white/70">Create a new password for your account</p>
              </div>

              {apiError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
                  {apiError}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">New Password</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black focus:border-black/30 focus:ring-2 focus:ring-black/80 outline-none transition-all bg-transparent text-black"
                    placeholder="12345678"
                  />
                  {errors.newPassword && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">Confirm Password</label>
                  <input
                    type="password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-black focus:border-black/30 focus:ring-2 focus:ring-black/80 outline-none transition-all bg-transparent text-black"
                    placeholder="12345678"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isResetPasswordPending}
                  className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isResetPasswordPending ? 'Updating Password...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}