import { Link } from "react-router-dom";
import { useState } from "react";
import { signin } from "../../services";
import { useDashboardContext } from "../../context/DashboardContext";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSigninLoading, setIsSigninLoading] = useState(false);
  const [signinError, setSigninError] = useState<string | null>(null);

  const { handleUpdateUserData, globalError } = useDashboardContext();

  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSigninLoading(true);
    try {
      await signin(email, password);
      await handleUpdateUserData();
    } catch (error) {
      setSigninError(error instanceof Error ? error.message : "Signin failed");
    } finally {
      setIsSigninLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-6 text-center">
          Sign in to your account
        </h2>
        <div className="mb-4 text-center text-gray-600 dark:text-gray-400">
          Return to Home?{" "}
          <Link
            to="/"
            className="text-blue-600 dark:text-blue-300 hover:underline"
          >
            Go to Home
          </Link>
        </div>
        {globalError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {globalError}
          </div>
        )}
        {signinError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {signinError}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSignin}>
          <div>
            <label
              className="block text-gray-700 dark:text-gray-200 mb-1"
              htmlFor="email"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 dark:text-gray-200 mb-1"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span className="ml-2 text-gray-700 dark:text-gray-200">
                Show Password
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-blue-600 dark:text-blue-300 hover:underline text-sm"
            >
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold text-lg shadow hover:scale-105 transition"
            disabled={isSigninLoading || !!globalError}
          >
            {isSigninLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 dark:text-blue-300 hover:underline
          "
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signin;
