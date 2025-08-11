/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useDashboardContext } from "../../context";
import { useNavigate, Link } from "react-router-dom";
import SignoutBtn from "../../components/SignoutBtn";

function Verify() {
  const { userData, handleVerifyUserEmail, isVerified } = useDashboardContext();
  const user = userData?.user || {};
  const [providedCode, setProvidedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingCode, setLoadingCode] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [email, setEmail] = useState(user?.emails[0]?.email || "");
  useEffect(() => {
    setEmail(user?.emails[0]?.email || "");
  }, [user]);
  const [verifySuccess, setVerifySuccess] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (verifyError) {
      setTimeout(() => {
        setVerifyError("");
      }, 5000);
    }
  }, [verifyError]);

  const sendVerificationEmail = async () => {
    setLoading(true);
    setVerifySuccess("");
    setVerifyError("");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verification/send`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );
      if (!response.ok) {
        let data = null;
        try {
          const text = await response.text();
          data = text ? JSON.parse(text) : null;
        } catch (error) {
          // ignore parse error
        }
        throw new Error(
          (data && data.message) || "Failed to send verification email."
        );
      }
      setVerifySuccess("Verification email sent successfully!");
      setVerificationSent(true);
    } catch (error: any) {
      if (
        error.message ===
          "Verification email already sent. Please check your inbox" ||
        error.message ===
          "Verification email sent successfully! Please check your inbox" ||
        error.message ===
          "Verification email already sent. Please check your inbox."
      ) {
        setVerificationSent(true);
      }
      setVerifyError(error.message || "Error sending verification email.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingCode(true);
    setVerifySuccess("");
    setVerifyError("");
    try {
      await handleVerifyUserEmail(email, providedCode);
      setVerifySuccess("Your account has been verified!");
      setVerificationSent(false);
    } catch (error: any) {
      setVerifyError(error.message || "Error verifying code.");
    } finally {
      setLoadingCode(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 bg-white/70 dark:bg-gray-900/70 shadow-md backdrop-blur-md">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 tracking-tight">
          Saif<span className="text-blue-500 dark:text-blue-300">Marks</span>
        </h1>
        <div className="flex gap-5">
          <div className="w-25">
            <SignoutBtn />
          </div>
                 
                          <Link
          to="/"
          className="px-5 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Home
        </Link>
        </div>

      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          {isVerified ? (
            <div className="rounded-2xl shadow-lg p-8 flex flex-col items-center bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200/80 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800/80 text-blue-900 dark:text-blue-100 border border-blue-100 dark:border-gray-800 transition-colors duration-300">
              <svg
                className="w-12 h-12 text-green-500 mb-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h2 className="text-2xl font-bold mb-2">Account Verified</h2>
              <p className="text-base text-center">
                Your account has been successfully verified.
                <br />
                You can now access all features.
              </p>
            </div>
          ) : (
            <div className="rounded-2xl shadow-lg p-8 flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-blue-100/80 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800/80 text-blue-900 dark:text-blue-100 border border-blue-100 dark:border-gray-800 transition-colors duration-300">
              <svg
                className="w-12 h-12 text-yellow-400 mb-3"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                />
              </svg>
              <h2 className="text-2xl font-bold mb-2">Account Not Verified</h2>
              <p className="text-base text-center mb-4">
                Please verify your account by clicking the link sent to your
                email address.
              </p>
              <div className="w-full flex flex-col items-center mb-2">
                <span className="font-semibold mb-2">
                  Email: <span className="font-normal">{email}</span>
                </span>
                {!verificationSent && (
                  <button
                    onClick={loading ? undefined : sendVerificationEmail}
                    className="mt-2 px-6 py-3 rounded-full bg-blue-600/90 text-white font-semibold shadow hover:bg-blue-700 transition"
                  >
                    {loading ? "Sending..." : "Send Verification Email"}
                  </button>
                )}
              </div>
              {verifySuccess && (
                <div className="text-green-600 font-semibold mt-2">
                  {verifySuccess}
                </div>
              )}
              {verifyError && (
                <div className="text-red-600 font-semibold mt-2">
                  {verifyError}
                </div>
              )}
              {verificationSent && (
                <form
                  onSubmit={handleVerifyCode}
                  className="w-full flex flex-col items-center mt-6"
                >
                  <label htmlFor="providedCode" className="mb-2 font-semibold">
                    Enter Verification Code
                  </label>
                  <input
                    type="text"
                    id="providedCode"
                    value={providedCode}
                    onChange={(e) => setProvidedCode(e.target.value)}
                    className="mb-2 p-2 rounded-lg border w-64 bg-white/80 text-blue-900 border-blue-200 dark:bg-gray-800/80 dark:text-blue-100 dark:border-blue-900"
                    placeholder="Enter the code from your email"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loadingCode}
                    className="px-6 py-2 rounded-full bg-blue-600/90 text-white font-semibold shadow hover:bg-blue-700 transition"
                  >
                    {loadingCode ? "Verifying..." : "Verify Code"}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer Actions */}
      <div className="max-w-2xl mx-auto py-6 px-4 flex justify-center gap-4">
        <button
          onClick={() => navigate("/contact")}
          className="px-6 py-3 rounded-full bg-blue-400/90 text-white font-semibold shadow hover:bg-blue-500 transition"
        >
          Contact Support
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} SaifMarks. All rights reserved.
      </footer>
    </div>
  );
}
export default Verify;
