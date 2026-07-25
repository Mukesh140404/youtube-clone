import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState, useRef } from 'react'
import { SignupApi } from '../../client/user.api'

export const Route = createFileRoute('/(auth)/Signup')({
  component: Signup,
})

function Signup() {
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [coverImage, setCoverImage] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const avatarInputRef = useRef<HTMLInputElement>(null)
  const coverImageInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!avatar || !coverImage) {
      setError('Please select both an avatar and a cover image.')
      setLoading(false)
      return
    }

    const payload = {
      fullName,
      username,
      email,
      password,
      avatar,
      coverImage
    }

    console.log("Sending Form Data payload:", {
      ...payload,
      avatar: avatar.name,
      coverImage: coverImage.name
    })

    try {
      await SignupApi(payload)
      navigate({ to: '/Login' })
    } catch (err: any) {
      console.error("Signup failed:", err)
      setError(err?.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen overflow-hidden relative bg-gray-50 flex flex-col md:flex-row">
      <div className="w-full h-screen">
        <img
          src="/login-banner.jpeg"
          alt="Signup Banner"
          className="h-screen w-full object-cover"
        />
      </div>
      <div
        className="
         md:w-3/7 w-full
         h-screen
        absolute
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              Create an Account
            </h1>
            <p className="text-white/70">Sign up to get started</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black focus:border-black/30 focus:ring-2 focus:ring-black/80 outline-none transition-all bg-transparent text-black"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-black mb-2">Username</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-black focus:border-black/30 focus:ring-2 focus:ring-black/80 outline-none transition-all bg-transparent text-black"
                  placeholder="johndoe123"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black focus:border-black/30 focus:ring-2 focus:ring-black/80 outline-none transition-all bg-transparent text-black"
                placeholder="hc@h.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black focus:border-black/30 focus:ring-2 focus:ring-black/80 outline-none transition-all bg-transparent text-black"
                placeholder="12345678"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Avatar</label>
                <div
                  onClick={() => avatarInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-black rounded-xl p-4 text-center hover:bg-black/10 transition-colors"
                >
                  <input
                    type="file"
                    accept="image/*"
                    ref={avatarInputRef}
                    className="hidden"
                    onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                  />
                  <span className="text-sm text-black/70 line-clamp-1">
                    {avatar ? avatar.name : "Select Avatar"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Cover Image</label>
                <div
                  onClick={() => coverImageInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-black rounded-xl p-4 text-center hover:bg-black/10 transition-colors"
                >
                  <input
                    type="file"
                    accept="image/*"
                    ref={coverImageInputRef}
                    className="hidden"
                    onChange={(e) => setCoverImage(e.target.files?.[0] || null)}
                  />
                  <span className="text-sm text-black/70 line-clamp-1">
                    {coverImage ? coverImage.name : "Select Cover"}
                  </span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-8 text-center text-black text-sm">
            Already have an account?{' '}
            <Link to="/Login" className="text-rose-600 hover:text-rose-700 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
