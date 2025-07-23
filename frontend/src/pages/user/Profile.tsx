/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboardContext } from "../../context";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Profile = () => {
  const {
    userData,
    handleDeleteUser,
    handleChangePassword,
    handleEditUserData,
  } = useDashboardContext();

  // Profile edit state
  const [formData, setFormData] = useState({
    firstName: userData.user.firstName || "",
    lastName: userData.user.lastName || "",
  });
  const [loading, setLoading] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

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

  // Delete user popup and fields
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");

  // Hide profile success/error after 10s
  useEffect(() => {
    if (profileSuccess || profileError) {
      const timer = setTimeout(() => {
        setProfileSuccess("");
        setProfileError("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [profileSuccess, profileError]);

  // Hide password success/error after 10s
  useEffect(() => {
    if (pwSuccess || pwError) {
      const timer = setTimeout(() => {
        setPwSuccess("");
        setPwError("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [pwSuccess, pwError]);

  // Hide delete success/error after 10s
  useEffect(() => {
    if (deleteSuccess || deleteError) {
      const timer = setTimeout(() => {
        setDeleteSuccess("");
        setDeleteError("");
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [deleteSuccess, deleteError]);

  // Handle profile form change
  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle password form change
  const handlePasswordChange = (e: any) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Change password handler
  const changeUserPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPwLoading(true);
    setPwSuccess("");
    setPwError("");
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPwError("New passwords do not match.");
      setPwLoading(false);
      return;
    }
    try {
      await handleChangePassword(passwordData);
      setPwSuccess("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error: any) {
      setPwError(error.message || "Failed to change password.");
    } finally {
      setPwLoading(false);
    }
  };

  // Delete user handler
  const deleteUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDeleteLoading(true);
    setDeleteError("");
    setDeleteSuccess("");
    if (deleteConfirm !== "I am sure") {
      setDeleteError("You must type 'I am sure' to confirm deletion.");
      setDeleteLoading(false);
      return;
    }
    if (!deletePassword) {
      setDeleteError("Please enter your password to confirm deletion.");
      setDeleteLoading(false);
      return;
    }
    try {
      await handleDeleteUser({ password: deletePassword });
      setDeleteSuccess("Your account has been deleted.");
      setShowDeletePopup(false);
      // Optionally, redirect or log out the user here
    } catch (error: any) {
      setDeleteError(error.message || "Failed to delete account.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen transition-colors duration-300">
        <div className="max-w-4xl mx-auto py-12 px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Card */}
            <div className="flex-1 bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg p-8 mb-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-1">
                  Profile
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-200">
                  Hello,{" "}
                  <span className="font-bold text-blue-600 dark:text-blue-300">
                    {userData.user.firstName}{" "}
                    {userData.user.lastName ? userData.user.lastName : ""}
                  </span>
                </p>
              </div>
              <form
                className="space-y-5"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  setProfileSuccess("");
                  setProfileError("");
                  const formDataToSubmit = {
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                  };
                  if (
                    !formDataToSubmit.firstName &&
                    !formDataToSubmit.lastName
                  ) {
                    setProfileError("Please fill at least one field.");
                    setLoading(false);
                    return;
                  }
                  await handleEditUserData(formDataToSubmit)
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
                    Email
                  </span>
                  <span className="text-gray-900 dark:text-gray-100 font-semibold">
                    {userData.user.emails.find((email) => email.isPrimary)
                      ?.email || "N/A"}
                  </span>
                </div>
                {profileSuccess && (
                  <div className="text-green-600 font-semibold mb-2">
                    {profileSuccess}
                  </div>
                )}
                {profileError && (
                  <div className="text-red-600 font-semibold mb-2">
                    {profileError}
                  </div>
                )}
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <span className="block text-gray-700 dark:text-gray-200 mb-1">
                      Joined
                    </span>
                    <span className="text-gray-900 dark:text-gray-100">
                      {userData.user.createdAt
                        ? new Date(userData.user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
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
            <div className="flex-1 bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg p-8 mb-8">
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
                  <div className="text-red-600 font-semibold mt-2">
                    {pwError}
                  </div>
                )}
                <div className="flex justify-end mt-4">
                  <div className="flex-1 flex items-center">
                    <Link
                      to="/forgot-password"
                      className="text-sm text-blue-600 hover:underline dark:text-blue-400 mr-4"
                    >
                      Forgot Password?
                    </Link>
                  </div>
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

          {/* Delete User Card */}
          <div className="bg-white/80 dark:bg-gray-900/80 rounded-xl shadow-lg p-8 mt-8">
            <label className="text-lg font-semibold block mb-2 text-red-600 dark:text-red-400">
              Delete Account
            </label>
            <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
              This action is{" "}
              <span className="font-bold text-red-600">irreversible</span>.
            </p>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={() => setShowDeletePopup(true)}
                className="px-6 py-3 rounded-lg text-white font-semibold transition bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
              >
                Delete Account
              </button>
            </div>
            {deleteSuccess && (
              <div className="text-green-600 font-semibold mt-4">
                {deleteSuccess}
              </div>
            )}
            {deleteError && (
              <div className="text-red-600 font-semibold mt-4">
                {deleteError}
              </div>
            )}
          </div>

          {/* Delete Confirmation Popup */}
          {showDeletePopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 max-w-sm w-full">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
                  Confirm Account Deletion
                </h2>
                <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">
                  To confirm, type <span className="font-bold">I am sure</span>{" "}
                  and enter your password below.
                </p>
                <form onSubmit={deleteUser} className="space-y-4">
                  <input
                    type="text"
                    value={deleteConfirm}
                    onChange={(e) => setDeleteConfirm(e.target.value)}
                    placeholder="Type: I am sure"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                  <input
                    type="password"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                  {deleteError && (
                    <div className="text-red-600 font-semibold">
                      {deleteError}
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeletePopup(false);
                        setDeleteConfirm("");
                        setDeletePassword("");
                        setDeleteError("");
                      }}
                      className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={deleteLoading}
                      className="px-6 py-2 rounded-lg text-white font-semibold transition bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
                    >
                      {deleteLoading ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};
export default Profile;
