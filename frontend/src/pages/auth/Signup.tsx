import { useState } from "react";
import { type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { SignUpReturn, UserType } from "../../types";
import { signup } from "../../services";
import { useDashboardContext } from "../../context";

const comparePasswords = (password: string, confirmPassword: string) => {
  return password === confirmPassword;
};

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [isSignupLoading, setIsSignupLoading] = useState(false);

  const {} = useDashboardContext();
  const navigate = useNavigate();

  const handleSignup = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<SignUpReturn> => {
    e.preventDefault();
    setIsSignupLoading(true);
    try {
      if (!firstName || !email || !password || !confirmPassword) {
        return {
          success: false,
          message: "You forget some required fields",
          user: null,
        };
      }
      if (!comparePasswords(password, confirmPassword)) {
        return {
          success: false,
          message: "Passwords do not match.",
          user: null,
        };
      }
      const userData: UserType = await signup({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      if (userData && userData.id && userData.email) {
        navigate("/signin");
      }
      return {
        success: false,
        message: "Signup failed",
        user: null,
      };
    } catch (error) {
      console.error("Error during signup:", error);
      return {
        success: false,
        message: "An error occurred during signup",
        user: null,
      };
    } finally {
      setIsSignupLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-6 text-center">
          Create your account
        </h2>
        <form className="space-y-5" onSubmit={handleSignup}>
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label
                className="block text-gray-700 dark:text-gray-200 mb-1"
                htmlFor="firstName"
              >
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="w-1/2">
              <label
                className="block text-gray-700 dark:text-gray-200 mb-1"
                htmlFor="lastName"
              >
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
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
          <div>
            <label
              className="block text-gray-700 dark:text-gray-200 mb-1"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold text-lg shadow hover:scale-105 transition"
            disabled={isSignupLoading}
          >
            {isSignupLoading ? "Signing..." : "Sign Up"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="text-blue-600 dark:text-blue-300 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
