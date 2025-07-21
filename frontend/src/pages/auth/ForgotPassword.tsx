/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDashboardContext } from "../../context/DashboardContext";

function ForgotPassword() {
  const navigate = useNavigate();
  const { handleSendResetPassword, handleResetPassword } =
    useDashboardContext();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForget = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await handleSendResetPassword(email);
      setStep(2);
      setMessage("Check your email for the reset code.");
    } catch (err: any) {
      setMessage(err.message || "Failed to send reset email.");
    }
    setLoading(false);
  };

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      await handleResetPassword(email, token, newPassword);
      setMessage("Password reset successful. You can now log in.");
      setStep(3);
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err: any) {
      setMessage(err.message || "Failed to reset password.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-md w-full p-8 bg-white dark:bg-gray-900 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700 dark:text-blue-400">
          Forgot Password
        </h2>
        {message && (
          <div className="mb-4 p-3 rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm">
            {message}
          </div>
        )}
        {step === 1 && (
          <>
            <form onSubmit={handleForget} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                  Email:
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-800 dark:text-blue-100 dark:border-gray-700"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Email"}
              </button>
            </form>
            <Link
              to="/signin"
              className="text-blue-600 dark:text-blue-300 hover:underline mt-4 block text-center"
            >
              Go to Sign In
            </Link>
          </>
        )}
        {step === 2 && (
          <>
            <h3 className="text-lg font-semibold mb-4 text-blue-700 dark:text-blue-300">
              Reset Password
            </h3>
            <form onSubmit={handleReset} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                  Reset Code:
                </label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-800 dark:text-blue-100 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                  New Password:
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400 dark:bg-gray-800 dark:text-blue-100 dark:border-gray-700"
                />
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="show-password"
                    className="mr-2"
                    checked={showPassword}
                    onChange={() => setShowPassword((v) => !v)}
                  />
                  <label
                    htmlFor="show-password"
                    className="text-sm text-gray-700 dark:text-gray-200"
                  >
                    Show Password
                  </label>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-60"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
        {step === 3 && (
          <div className="text-center mt-6">
            <p className="text-green-700 dark:text-green-400 font-semibold">
              Password has been reset. You may now log in.
            </p>
            <Link
              to="/signin"
              className="text-blue-600 dark:text-blue-300 hover:underline"
            >
              Go to Sign In
            </Link>{" "}
            Or wait for automatic redirect.
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
