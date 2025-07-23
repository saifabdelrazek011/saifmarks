import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboardContext } from "../../context";
import { useState, useEffect } from "react";
import type { ShortUrlType } from "../../types";
import ShortUrlCard from "../../components/dashboard/ShorturlCard";

function ShortUrls() {
  const {
    shortUrls,
    isShortUrlsLoading,
    handleAddShortUrl,
    handleEditShortUrl,
    handleDeleteShortUrl,
  } = useDashboardContext();

  const [creating, setCreating] = useState(false);
  const [newUrl, setNewUrl] = useState({ fullUrl: "", shortUrl: "" });
  const [editUrl, setEditUrl] = useState<ShortUrlType | null>(null);
  const [editData, setEditData] = useState({ fullUrl: "", shortUrl: "" });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleNewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUrl({ ...newUrl, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleAddShortUrl(newUrl.fullUrl, newUrl.shortUrl);
      setNewUrl({ fullUrl: "", shortUrl: "" });
      setCreating(false);
    } catch (err: any) {
      setError(err.message || "Failed to create short URL");
    }
  };

  const handleEdit = (url: ShortUrlType) => {
    setEditUrl(url);
    setEditData({ fullUrl: url.fullUrl, shortUrl: url.shortUrl });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    if (!editUrl) return;
    try {
      await handleEditShortUrl(editUrl.id, editData.fullUrl, editData.shortUrl);
      setEditUrl(null);
    } catch (err: any) {
      setError(err.message || "Failed to update short URL");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await handleDeleteShortUrl(id);
    } catch (err: any) {
      setError(err.message || "Failed to delete short URL");
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 p-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-6">
            Your Short URLs
          </h1>
          {!creating && (
            <div className="text-right">
              <button
                onClick={() => setCreating(true)}
                className="inline-block bg-blue-700 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-900 transition font-semibold border border-blue-900 dark:border-blue-900"
              >
                + Create New Short URL
              </button>
            </div>
          )}
        </div>
        {error && (
          <div className="mb-4 text-center text-red-500 dark:text-red-400 font-semibold">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6">
          {creating && (
            <form
              onSubmit={handleCreate}
              className="w-full rounded-xl shadow-lg p-4 flex flex-col gap-4 items-stretch max-w-3xl mx-auto bg-gray-50 dark:bg-gray-800 border-2 border-blue-700 dark:border-blue-400"
              style={{ background: "none" }}
            >
              <input
                name="fullUrl"
                value={newUrl.fullUrl}
                onChange={handleNewChange}
                className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-black dark:text-white transition"
                type="url"
                placeholder="Paste the full URL here"
                required
                autoFocus
              />
              <input
                name="shortUrl"
                value={newUrl.shortUrl}
                onChange={handleNewChange}
                className="w-full px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-black dark:text-white transition"
                type="text"
                placeholder="Custom short code (optional)"
              />
              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <button
                  type="submit"
                  className="flex-1 px-6 py-2 rounded-lg bg-blue-700 text-white font-semibold shadow hover:bg-gray-900 transition"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setCreating(false)}
                  className="flex-1 px-6 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-blue-700 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {isShortUrlsLoading ? (
              <div className="w-full text-center text-blue-700 dark:text-blue-400 py-8">
                Loading Short URLs...
              </div>
            ) : shortUrls.length === 0 ? (
              <div className="w-full text-center text-gray-500 dark:text-gray-400 py-8">
                No short URLs found.
              </div>
            ) : (
              shortUrls.map((url) => (
                <ShortUrlCard
                  key={url.id}
                  url={url}
                  editFunc={handleEdit}
                  deleteFunc={handleDelete}
                />
              ))
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {editUrl && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md border-2 border-blue-700 dark:border-blue-400">
              <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-200">
                Edit Short URL
              </h2>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Full URL
                <input
                  name="fullUrl"
                  value={editData.fullUrl}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 rounded border border-blue-200 dark:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-black dark:text-white transition mt-1"
                  type="url"
                  required
                />
              </label>
              <label className="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                Short Code
                <input
                  name="shortUrl"
                  value={editData.shortUrl}
                  onChange={handleEditChange}
                  className="w-full px-3 py-2 rounded border border-blue-200 dark:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-black dark:text-white transition mt-1"
                  type="text"
                  required
                />
              </label>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleEditSave}
                  className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-gray-900 dark:hover:bg-blue-900"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditUrl(null)}
                  className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ShortUrls;
