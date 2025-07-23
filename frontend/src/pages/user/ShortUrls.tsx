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
  const [editUrlId, setEditUrlId] = useState<string | null>(null);
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
    setEditUrlId(url.id);
    setEditData({ fullUrl: url.fullUrl, shortUrl: url.shortUrl });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    if (!editUrlId) return;
    try {
      await handleEditShortUrl(editUrlId, editData.fullUrl, editData.shortUrl);
      setEditUrlId(null);
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
              shortUrls.map((url) =>
                editUrlId === url.id ? (
                  <div
                    key={url.id}
                    className="flex flex-col gap-2 bg-white dark:bg-gray-900 rounded-xl shadow p-4 w-full relative"
                  >
                    <div className="flex flex-col gap-1 mb-2">
                      <label className="text-xs text-gray-500 dark:text-gray-400">
                        Full URL
                      </label>
                      <input
                        name="fullUrl"
                        value={editData.fullUrl}
                        onChange={handleEditChange}
                        className="px-2 py-1 rounded border border-blue-300 dark:border-blue-800 bg-white dark:bg-gray-800 text-blue-900 dark:text-blue-100"
                      />
                    </div>
                    <div className="flex flex-col gap-1 mb-2">
                      <label className="text-xs text-gray-500 dark:text-gray-400">
                        Short URL
                      </label>
                      <input
                        name="shortUrl"
                        value={editData.shortUrl}
                        onChange={handleEditChange}
                        className="px-2 py-1 rounded border border-blue-300 dark:border-blue-800 bg-white dark:bg-gray-800 text-blue-900 dark:text-blue-100"
                      />
                    </div>
                    <div className="flex gap-4 mt-2">
                      <button
                        className="flex-1 h-10 px-3 py-1 rounded bg-blue-700 text-white text-base font-semibold hover:bg-blue-800 transition"
                        onClick={handleEditSave}
                      >
                        Save
                      </button>
                      <button
                        className="flex-1 h-10 px-3 py-1 rounded bg-gray-300 text-blue-700 text-base font-semibold hover:bg-gray-400 transition dark:bg-gray-800 dark:text-blue-200 dark:hover:bg-gray-900"
                        onClick={() => setEditUrlId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <ShortUrlCard
                    key={url.id}
                    url={url}
                    editFunc={handleEdit}
                    deleteFunc={handleDelete}
                  />
                )
              )
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ShortUrls;
