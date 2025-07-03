import React, { useEffect, useState } from "react";
import { useDashboardContext } from "../../context/DashboardContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";

const Profile = () => {
  const {
    userData,
    handleChangePassword,
    handleSendVerificationCode,
    handleVerifyUserEmail,
    handleEditUserData,
  } = useDashboardContext();

  const [user, setUser] = useState(userData?.user || null);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.emails || [],
  });

  const [loading, setLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");
  const [verifySuccess, setVerifySuccess] = useState("");
  const [verifyError, setVerifyError] = useState("");

  const navigate = useNavigate();

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [providedCode, setProvidedCode] = useState("");
  const [email, setEmail] = useState(user?.emails[0]?.email || "");
  const [loadingCode, setLoadingCode] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  useEffect(() => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.emails || [],
    });
  }, [user]);

  useEffect(() => {
    if (verifyError) {
      setTimeout(() => {
        setVerifyError("");
      }, 5000);
    }
  }, [verifyError]);

  useEffect(() => {
    if (profileError) {
      setTimeout(() => {
        setProfileError("");
      }, 5000);
    }
  }, [profileError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Password change handlers
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const changeUserPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPwLoading(true);
    setPwSuccess("");
    setPwError("");

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPwError("New passwords do not match.");
      return;
    }
    try {
      await handleChangePassword(passwordData);
    } catch (error: any) {
      setPwError(error.message || "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  };

  const verifyUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingCode(true);
    setVerifySuccess("");
    setVerifyError("");
    try {
      await handleVerifyUserEmail(email, providedCode);
    } catch (error: any) {
      setVerifyError(error.message || "Error verifying code.");
    } finally {
      setLoadingCode(false);
    }
  };

  const sendVerificationEmail = async () => {
    setLoading(true);
    setVerifySuccess("");
    setVerifyError("");
    try {
      await handleSendVerificationCode(email);
    } catch (error: any) {
      setVerifyError(error.message || "Error sending verification email.");
    } finally {
      setLoading(false);
    }
  };

  const editUserData = async (formData: {
    firstName: string;
    lastName: string;
  }) => {
    setLoading(true);
    setProfileSuccess("");
    setProfileError("");
    try {
      await handleEditUserData({
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
      setProfileSuccess("Profile updated successfully!");
    } catch (error: any) {
      setProfileError(error.message || "Error updating user data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <div className="max-w-xl mx-auto py-12 px-4">
          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-1">
                  Profile
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-200">
                  Hello,{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-300">
                    {user.firstName} {user.lastName ? user.lastName : ""}
                  </span>
                </p>
              </div>
              <a
                href="https://status.saifabdelrazek.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center ml-4"
                title="View detailed service status"
              >
                <img
                  src={
                    "https://uptime.saifabdelrazek.com/api/badge/3/status?upColor=%2360a5fa&downColor=%23f87171&pendingColor=%23fbbf24&maintenanceColor=%234ade80&style=for-the-badge"
                  }
                  alt="Service Status"
                  className="h-6 mr-2 drop-shadow-lg rounded-full border border-white"
                />
              </a>
            </div>
            <form
              className="space-y-5"
              onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setProfileSuccess("");
                setProfileError("");
                await editUserData(formData)
                  .then(() => {
                    setProfileSuccess("Profile updated successfully!");
                  })
                  .catch((e: { message: any }) => {
                    setProfileError(e.message || "Error updating user data.");
                  })
                  .finally(() => setLoading(false));
              }}
            >
              <div>
                <label
                  className="block text-gray-700 dark:text-gray-200 mb-1"
                  htmlFor="firstName"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 dark:text-gray-200 mb-1"
                  htmlFor="lastName"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <span className="block text-gray-700 dark:text-gray-200 mb-1">
                  Joined
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              {profileSuccess && (
                <div className="text-green-600 font-semibold">
                  {profileSuccess}
                </div>
              )}
              {profileError && (
                <div className="text-red-600 font-semibold">{profileError}</div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-lg text-white font-semibold transition bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8">
            <form onSubmit={changeUserPassword} className="space-y-5">
              <label className="text-lg font-semibold block mb-2 text-blue-700 dark:text-blue-400">
                Change Password
              </label>
              <div>
                <label
                  htmlFor="current-password"
                  className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
                >
                  Current Password
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  id="current-password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your current password"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="new-password"
                  className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
                >
                  New Password
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  id="new-password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your new password"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="confirm-new-password"
                  className="block mb-1 font-medium text-gray-700 dark:text-gray-200"
                >
                  Confirm New Password
                </label>
                <input
                  type={showPasswords ? "text" : "password"}
                  id="confirm-new-password"
                  name="confirmNewPassword"
                  value={passwordData.confirmNewPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Confirm your new password"
                  required
                />
              </div>
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="show-passwords"
                  className="mr-2"
                  checked={showPasswords}
                  onChange={(e) => setShowPasswords(e.target.checked)}
                />
                <label
                  htmlFor="show-passwords"
                  className="text-sm text-gray-700 dark:text-gray-200"
                >
                  Show Passwords
                </label>
              </div>
              {pwSuccess && (
                <div className="text-green-600 font-semibold mt-2">
                  {pwSuccess}
                </div>
              )}
              {pwError && (
                <div className="text-red-600 font-semibold mt-2">{pwError}</div>
              )}
              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  disabled={pwLoading}
                  className="px-6 py-3 rounded-lg text-white font-semibold transition bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  {pwLoading ? "Changing..." : "Change Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
