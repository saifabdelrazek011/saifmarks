import { useState, useEffect, useMemo } from "react";
import { useDashboardContext } from "../../context";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import DOMPurify from "dompurify";
import Navbar from "../../components/Navbar";

const initialForm = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

function Contact() {
  const { userData, isAuthenticated } = useDashboardContext();
  const navigate = useNavigate();
  const user = userData?.user || null;

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Form input configuration
  const formInputs = useMemo(
    () => [
      {
        id: "name",
        label: "Full Name",
        type: "text",
        readOnly: !!(user?.firstName || user?.lastName),
        value:
          user?.firstName || user?.lastName
            ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
            : form.name,
      },
      {
        id: "email",
        label: "Email Address",
        type: "email",
        readOnly: !!(user?.emails && user.emails[0]?.email),
        value:
          user?.emails && user.emails[0]?.email
            ? user.emails[0].email
            : form.email,
      },
      {
        id: "subject",
        label: "Subject",
        type: "text",
        readOnly: false,
        value: form.subject,
      },
    ],
    [user, form]
  );

  // Autofill name/email if user is logged in
  useEffect(() => {
    if (
      user?.firstName ||
      user?.lastName ||
      (user?.emails && user.emails[0]?.email)
    ) {
      setForm((prev) => ({
        ...prev,
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        email: user.emails[0]?.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (errorMsg) {
      const timer = setTimeout(() => setErrorMsg(""), 10000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errors = [];
    if (!form.name.trim()) errors.push("Name is required");
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email))
      errors.push("Valid email is required");
    if (!form.subject.trim()) errors.push("Subject is required");
    if (!form.message.trim()) errors.push("Message is required");
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrorMsg(validationErrors.join(", "));
      return;
    }

    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const name = DOMPurify.sanitize(form.name);
      const senderEmail = DOMPurify.sanitize(form.email);
      const subject = DOMPurify.sanitize(form.subject);
      const message = DOMPurify.sanitize(form.message);

      const res = await api.post("/email/contact", {
        senderEmail,
        name,
        subject,
        message,
      });
      const data = res.data;

      if (data.success) {
        setSuccessMsg(
          "Your message has been sent! We'll get back to you soon."
        );
        setForm(
          user?.firstName ||
            user?.lastName ||
            (user?.emails && user.emails[0]?.email)
            ? { ...initialForm, name: form.name, email: form.email }
            : initialForm
        );
      } else {
        setErrorMsg(data.message || "Failed to send message.");
      }
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Failed to send message. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Navbar */}
      <Navbar hideContact={true} />

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-700 dark:text-blue-400 mb-2">
              Contact Us
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-200">
              We'd love to hear from you! Fill out the form below and we'll
              reply as soon as possible.
            </p>
          </div>
          <form
            className="space-y-6 text-lg rounded-xl p-8 bg-white text-blue-900 dark:bg-gray-900 dark:text-blue-100 shadow-lg"
            onSubmit={handleSubmit}
            noValidate
          >
            {formInputs.map((input) => (
              <div
                key={input.id}
                className="flex flex-col md:flex-row md:items-center md:gap-4"
              >
                <label
                  htmlFor={input.id}
                  className="font-semibold w-40 inline-block text-blue-900 dark:text-blue-100"
                >
                  {input.label}:
                </label>
                <input
                  type={input.type}
                  id={input.id}
                  name={input.id}
                  value={input.value}
                  onChange={handleChange}
                  required
                  readOnly={input.readOnly}
                  className={`flex-1 px-3 py-2 border rounded transition-all duration-300 ${
                    input.readOnly
                      ? "bg-gray-100/70 border-gray-300 text-gray-500 cursor-not-allowed opacity-75 dark:bg-gray-800/50 dark:border-gray-700 dark:text-gray-400 dark:cursor-not-allowed dark:opacity-60"
                      : "bg-white text-blue-900 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-blue-100 dark:border-blue-900 dark:focus:ring-blue-600"
                  }`}
                  placeholder={`Enter your ${input.label.toLowerCase()}`}
                  aria-required="true"
                />
              </div>
            ))}

            <div className="flex flex-col md:flex-row md:gap-4">
              <label
                htmlFor="message"
                className="font-semibold w-40 inline-block mb-2 md:mb-0 text-blue-900 dark:text-blue-100"
              >
                Message:
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={6}
                className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 resize-none bg-white text-blue-900 border-blue-200 focus:ring-blue-400 dark:bg-gray-800 dark:text-blue-100 dark:border-blue-900 dark:focus:ring-blue-600"
                placeholder="Tell us how we can help you..."
                aria-required="true"
              ></textarea>
            </div>

            {successMsg && (
              <div
                role="alert"
                className="p-4 rounded-lg text-center font-medium text-green-600 bg-green-100 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700"
              >
                {successMsg}
              </div>
            )}

            {errorMsg && (
              <div
                role="alert"
                className="p-4 rounded-lg text-center font-medium text-red-600 bg-red-100 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700"
              >
                {errorMsg}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-300 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                }`}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div
                      role="status"
                      className="flex items-center justify-center"
                    >
                      <span className="sr-only">Loading...</span>
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>
            </div>
          </form>
        </div>
        {/* Additional Contact Info */}
        <div className="mt-8 rounded-xl shadow-lg p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 text-blue-900 dark:from-blue-900 dark:via-gray-900 dark:to-gray-800 dark:text-blue-100">
          <h3 className="text-xl font-bold mb-4 text-center">
            Other Ways to Reach Us
          </h3>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8">
            <a
              href="https://github.com/saifabdelrazek011"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:scale-105 transition-transform text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-400"
              aria-label="Visit our GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="https://status.saifabdelrazek.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 hover:scale-105 transition-transform text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-400"
              aria-label="Check our service status"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>Service Status</span>
            </a>
          </div>
        </div>
        {/* Navigation Buttons */}
        <div className="mt-6 flex flex-wrap gap-4">
          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-300 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                aria-label="Return to Dashboard"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-300 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                aria-label="View Profile"
              >
                View Profile
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-300 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                aria-label="Return to Homepage"
              >
                Back to Home
              </button>
              <button
                onClick={() => navigate("/signin")}
                className="px-6 py-3 rounded-lg text-white font-semibold transition-colors duration-300 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                aria-label="Sign In"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Contact;
