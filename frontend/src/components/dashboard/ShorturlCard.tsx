import { useState } from "react";
import type { ShortUrlType } from "../../types";
import { Link } from "react-router-dom";
import { useDashboardContext } from "../../context";

function ShortUrlCard({
  url,
  editFunc,
  deleteFunc,
}: {
  url: ShortUrlType;
  editFunc: (url: ShortUrlType) => void;
  deleteFunc: (id: string) => void;
}) {
  const { shortDomain } = useDashboardContext();
  const [copied, setCopied] = useState(false);
  const [onDelete, setOnDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [onDeleteError, setDeleteError] = useState<string>("");

  const handleCopy = () => {
    const shortUrl = `${window.location.origin}/s/${url.shortUrl}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shortUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleDeleteClick = async () => {
    setDeleteLoading(true);
    setDeleteError("");
    try {
      await deleteFunc(url.id);
    } catch (err: any) {
      setDeleteError(err.message || "Failed to delete short URL");
    } finally {
      setDeleteLoading(false);
      setOnDelete(false);
    }
  };

  // Truncate long URLs for display, show full URL in tooltip
  const truncate = (str: string, n = 40) =>
    str.length > n ? str.slice(0, n - 1) + "…" : str;

  if (onDelete) {
    return (
      <div className="flex flex-col gap-2 bg-white/80 dark:bg-gray-900/80 rounded-xl shadow p-4 w-full sm:w-[48%] md:w-[31%] relative">
        <p className="font-bold text-red-700 dark:text-red-300 text-lg mb-5">
          Are you sure you want to delete this short URL?
        </p>
        <button
          className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition"
          onClick={handleDeleteClick}
          disabled={deleteLoading}
        >
          {deleteLoading ? "Deleting..." : "Yes"}
        </button>
        <button
          className="px-3 py-1.5 rounded-xl bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition"
          onClick={() => setOnDelete(false)}
          disabled={deleteLoading}
        >
          No
        </button>
        {onDeleteError && (
          <p className="text-red-500 text-xs mt-2">{onDeleteError}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 bg-white/80 dark:bg-gray-900/80 rounded-xl shadow p-4 w-full relative">
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Original URL
        </span>
        <a
          href={url.fullUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-700 underline hover:text-blue-500 dark:text-blue-200 dark:hover:text-blue-300 break-all"
          title={url.fullUrl}
        >
          {truncate(url.fullUrl)}
        </a>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Short URL
        </span>
        <a
          href={`${shortDomain}/${url.shortUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-2 py-1 rounded bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold text-sm dark:from-blue-900 dark:to-blue-400"
          title={`${shortDomain}/${url.shortUrl}`}
        >
          {url.shortUrl}
        </a>
        <button
          onClick={handleCopy}
          title="Copy short URL"
          className="p-1 rounded transition bg-gray-200 hover:bg-blue-100 text-blue-700 dark:bg-gray-800 dark:hover:bg-blue-900 dark:text-blue-200"
        >
          {copied ? (
            <span className="text-green-500 text-xs font-semibold">
              Copied!
            </span>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <rect
                x="9"
                y="9"
                width="13"
                height="13"
                rx="2"
                ry="2"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
              <rect
                x="3"
                y="3"
                width="13"
                height="13"
                rx="2"
                ry="2"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          )}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">Clicks</span>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold shadow bg-gradient-to-r from-blue-600 to-blue-400 text-white dark:from-blue-900 dark:to-blue-400">
          {url.clicks}
        </span>
      </div>
      {/* Bookmark info if exists */}
      {url.bookmark && (
        <div className="mt-2 p-2 rounded bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-blue-700 dark:text-blue-200 font-semibold">
              Connected Bookmark
            </span>
            <span className="font-bold text-blue-800 dark:text-blue-100">
              {url.bookmark.title}
            </span>
            {url.bookmark.description && (
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {url.bookmark.description}
              </span>
            )}
            {/* Link to the bookmark page */}
            <Link
              to={`/dashboard/#${url.bookmark.id}`}
              className="mt-2 inline-block px-3 py-1 rounded bg-gradient-to-r from-pink-500 to-yellow-400 text-white font-semibold text-xs shadow hover:from-yellow-400 hover:to-pink-500 transition"
              style={{ textDecoration: "none" }}
            >
              Go to Bookmark
            </Link>
          </div>
        </div>
      )}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => editFunc(url)}
          title="Edit"
          className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
        >
          <span className="hidden sm:inline">Edit</span>
          <span className="sm:hidden">✏️</span>
        </button>
        <button
          onClick={() => setOnDelete(true)}
          title="Delete"
          className="flex-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          <span className="hidden sm:inline">Delete</span>
          <span className="sm:hidden">🗑️</span>
        </button>
      </div>
    </div>
  );
}
export default ShortUrlCard;
