import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { loginApi } from "../../client/user.api";

export const Route = createFileRoute("/(auth)/Login")({
  component: Login,
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Formatting data exactly as requested
    const formData = {
      email,
      password,
    };

    try {
      await loginApi(formData);
      // Navigate to home page on successful login
      navigate({ to: "/" });
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(
        err?.response?.data?.message ||
        "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-full relative bg-gray-50 flex flex-col md:flex-row">
      <div className="w-full h-screen">
        <img
          src="/login-banner.jpeg"
          alt="Login Banner"
          className="h-screen w-full object-cover"
        />
      </div>
      <div
        className="
    w-9/10 md:w-3/7
     md:h-screen h-auto
    absolute rounded-xl md:rounded-none
    left-1/2 -translate-x-1/2
    md:left-auto md:right-0 md:translate-x-0
    top-1/2 -translate-y-1/2
    md:top-0 md:translate-y-0
    flex items-center justify-center
    p-4
    bg-white/15
  "
      >
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">
              Welcome Back
            </h1>
            <p className="text-white/70">Please sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-black mb-2">
                Email Address
              </label>
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
              <label className="block text-sm font-medium text-black mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black focus:border-black/30 focus:ring-2 focus:ring-black/80 outline-none transition-all bg-transparent text-black"
                placeholder="12345678"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-black cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2 rounded  border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Remember me
              </label>
              <button
                onClick={() => navigate({ to: "/forget-password" })}
                type="button"
                className="text--black font-medium transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white font-semibold py-3 rounded-xl hover:bg-gray-800 focus:ring-4 focus:ring-gray-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-black text-sm">
            Don't have an account?{" "}
            <Link
              to="/Signup"
              className="text-rose-600 hover:text-rose-700 font-semibold transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}