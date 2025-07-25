import DashboardLayout from "../../layouts/DashboardLayout";
import { useEffect, useState } from "react";
import Bookmark from "../../components/dashboard/Bookmark";
import { useDashboardContext } from "../../context";
import type { BookmarkType } from "../../types";

function Dashboard() {
  const { bookmarks, handleAddBookmark, handleEditBookmark, hideWelcome } =
    useDashboardContext();
  const [onCreate, setOnCreate] = useState<boolean>(false);
  const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);
  const [onCreateError, setOnCreateError] = useState<string>("");
  const [onEdit, setOnEdit] = useState<boolean>(false);
  const [isEditLoading, setIsEditLoading] = useState<boolean>(false);
  const [onEditError, setOnEditError] = useState<string>("");

  // Bookmarks Data
  const [editBookmarkData, setEditBookmarkData] = useState<BookmarkType>({
    id: "",
    url: "",
    title: "",
    description: "",
  });

  const handleEditDataChange = (e: any) => {
    setEditBookmarkData({
      ...editBookmarkData,
      [e.target.name]: e.target.value,
    });
  };

  const setEditBookmarkState = (bookmark: BookmarkType) => {
    setEditBookmarkData(bookmark);
    setOnEdit(true);
  };

  useEffect(() => {
    if (onCreateError) {
      const timer = setTimeout(() => {
        setOnCreateError("");
      }, 4000); // Show error for 4 seconds
      return () => clearTimeout(timer);
    }
  }, [onCreateError]);

  return (
    <DashboardLayout>
      <div className="flex-1 p-10">
        {!hideWelcome && (
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
              Welcome to your Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Here you can manage your bookmarks, profile, and settings.
            </p>
          </div>
        )}
        {/* Bookmarks Section */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300">
              Your Bookmarks
            </h2>
            {onCreate || onEdit ? (
              <button
                onClick={() => {
                  setOnCreate(false);
                  setOnEdit(false);
                }}
                className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              >
                Close
              </button>
            ) : (
              <button
                onClick={() => setOnCreate(true)}
                className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                + Add Bookmark
              </button>
            )}
          </div>
          {/* Error region above the form */}
          {onCreateError && (
            <div className="text-red-600 text-sm mb-2 text-center">
              {onCreateError}
            </div>
          )}
          <div className="mb-8">
            {onCreate && !onEdit && (
              <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 max-w-xl mx-auto animate-fade-in">
                <form
                  className="space-y-5"
                  action={async (formData) => {
                    setIsCreateLoading(true);
                    try {
                      const formDataObject: Omit<BookmarkType, "id"> = {
                        title: formData.get("title") as string,
                        url: formData.get("url") as string,
                        description: formData.get("description") as string,
                      };
                      await handleAddBookmark(formDataObject);
                      setOnCreate(false); // Hide form after creating
                    } catch (error: any) {
                      setOnCreateError(error.message);
                    } finally {
                      setIsCreateLoading(false);
                    }
                  }}
                >
                  <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
                    Add New Bookmark
                  </h3>
                  <div>
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
                    >
                      Title
                    </label>
                    <input
                      name="title"
                      id="title"
                      className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-black dark:text-white transition"
                      type="text"
                      placeholder="Bookmark Title"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="url"
                      className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
                    >
                      URL
                    </label>
                    <input
                      name="url"
                      id="url"
                      className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-black dark:text-white transition"
                      type="url"
                      placeholder="Bookmark URL"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
                    >
                      Description
                    </label>
                    <input
                      name="description"
                      id="description"
                      className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-black dark:text-white transition"
                      type="text"
                      placeholder="Description of the bookmark (Optional)"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg py-3 bg-gradient-to-r from-blue-600 to-gray-900 hover:from-gray-900 hover:to-blue-700 text-white font-semibold shadow-md transition"
                    disabled={isCreateLoading}
                  >
                    {isCreateLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          ></path>
                        </svg>
                        Creating...
                      </span>
                    ) : (
                      "Create"
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Edit popup modal */}
            {onEdit && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md border-2 border-blue-700 dark:border-blue-400">
                  <h3 className="text-xl font-semibold text-blue-700 dark:text-blue-300 mb-2">
                    Edit Bookmark
                  </h3>
                  {onEditError && (
                    <div className="text-red-600 text-sm mb-2 text-center">
                      {onEditError}
                    </div>
                  )}
                  <form
                    className="space-y-5"
                    action={async (formData) => {
                      setIsEditLoading(true);
                      try {
                        const formDataObject: BookmarkType = {
                          id: formData.get("id") as string,
                          title: formData.get("title") as string,
                          url: formData.get("url") as string,
                          description: formData.get("description") as string,
                        };
                        await handleEditBookmark(formDataObject);
                        setOnEdit(false);
                      } catch (error: any) {
                        setOnEditError(error.message);
                      } finally {
                        setIsEditLoading(false);
                      }
                    }}
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={editBookmarkData.id}
                    />
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
                      >
                        Title
                      </label>
                      <input
                        name="title"
                        id="title"
                        value={editBookmarkData.title}
                        onChange={handleEditDataChange}
                        placeholder="Bookmark Title"
                        className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-black dark:text-white transition"
                        type="text"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="url"
                        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
                      >
                        URL
                      </label>
                      <input
                        name="url"
                        id="url"
                        value={editBookmarkData.url}
                        onChange={handleEditDataChange}
                        placeholder="Bookmark URL"
                        className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-black dark:text-white transition"
                        type="url"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200"
                      >
                        Description
                      </label>
                      <input
                        name="description"
                        id="description"
                        placeholder="Description of the bookmark (Optional)"
                        value={editBookmarkData.description}
                        onChange={handleEditDataChange}
                        className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-black dark:text-white transition"
                        type="text"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full rounded-lg py-3 bg-gradient-to-r from-blue-700 to-gray-900 hover:from-gray-900 hover:to-blue-700 text-white font-semibold shadow-md transition"
                      disabled={isEditLoading}
                    >
                      {isEditLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8z"
                            ></path>
                          </svg>
                          Editing...
                        </span>
                      ) : (
                        "Edit"
                      )}
                    </button>
                  </form>
                  <button
                    onClick={() => setOnEdit(false)}
                    className="mt-4 w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((bookmark) => (
              <Bookmark
                key={bookmark.id}
                bookmark={bookmark}
                editFunction={setEditBookmarkState}
                setOnEdit={setOnEdit}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default Dashboard;
