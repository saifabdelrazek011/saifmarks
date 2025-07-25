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

  // Edit state
  const [onEdit, setOnEdit] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string>("");
  const [editData, setEditData] = useState({
    fullUrl: url.fullUrl,
    shortUrl: url.shortUrl,
  });

  // Highlight logic
  let highlightedId = "";
  if (typeof window !== "undefined") {
    const hash = window.location.hash;
    const match = hash.match(/#([a-z0-9]+)$/i);
    if (match) {
      highlightedId = match[1];
    }
  }
  const isHighlighted = url.id === highlightedId;

  const highlightCard =
    "bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-blue-900 dark:via-gray-900 dark:to-blue-950 border-2 border-blue-400 dark:border-blue-700 shadow-lg";

  const handleCopy = () => {
    const shortUrl = `${shortDomain.replace(/\/$/, "")}/${
      url.shortUrl
    }`;
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

  const truncate = (str: string, n = 40) =>
    str.length > n ? str.slice(0, n - 1) + "…" : str;

  // Edit handlers
  const handleEditClick = () => {
    setOnEdit(true);
    setEditData({
      fullUrl: url.fullUrl,
      shortUrl: url.shortUrl,
    });
    setEditError("");
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async () => {
    setEditLoading(true);
    setEditError("");
    try {
      await editFunc({ ...url, ...editData });
      setOnEdit(false);
    } catch (err: any) {
      setEditError(err.message || "Failed to save changes");
    } finally {
      setEditLoading(false);
    }
  };

  if (onDelete) {
    return (
      <div
        className={`flex flex-col gap-2 ${
          isHighlighted ? highlightCard : "bg-white dark:bg-gray-900"
        } rounded-xl shadow p-4 w-full relative`}
      >
        <p className="font-bold text-gray-900 dark:text-white text-lg mb-5">
          Are you sure you want to delete this short URL?
        </p>
        <div className="flex gap-4 mt-2">
          <button
            className="flex-1 h-10 px-3 py-1 rounded-xl bg-red-500 text-white text-base font-semibold hover:bg-red-600 transition"
            onClick={handleDeleteClick}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Yes"}
          </button>
          <button
            className="flex-1 h-10 px-3 py-1 rounded-xl bg-blue-700 text-white text-base font-semibold hover:bg-blue-800 transition"
            onClick={() => setOnDelete(false)}
            disabled={deleteLoading}
          >
            No
          </button>
        </div>
        {onDeleteError && (
          <p className="text-blue-700 dark:text-blue-400 text-xs mt-2">
            {onDeleteError}
          </p>
        )}
      </div>
    );
  }

  if (onEdit) {
    return (
      <div
        className={`flex flex-col gap-2 ${
          isHighlighted ? highlightCard : "bg-white dark:bg-gray-900"
        } rounded-xl shadow p-4 w-full relative`}
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
            disabled={editLoading}
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
            disabled={editLoading}
          />
        </div>
        {editError && (
          <p className="text-red-600 dark:text-red-400 text-xs mb-2">
            {editError}
          </p>
        )}
        <div className="flex gap-4 mt-2">
          <button
            className="flex-1 h-10 px-3 py-1 rounded bg-blue-700 text-white text-base font-semibold hover:bg-blue-800 transition"
            onClick={handleEditSave}
            disabled={editLoading}
          >
            {editLoading ? "Saving..." : "Save"}
          </button>
          <button
            className="flex-1 h-10 px-3 py-1 rounded bg-gray-300 text-blue-700 text-base font-semibold hover:bg-gray-400 transition dark:bg-gray-800 dark:text-blue-200 dark:hover:bg-gray-900"
            onClick={() => setOnEdit(false)}
            disabled={editLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col gap-2 ${
        isHighlighted ? highlightCard : "bg-white dark:bg-gray-900"
      } rounded-xl shadow p-4 w-full relative`}
    >
      <div className="flex flex-col gap-1">
        <span className="font-bold text-blue-900 dark:text-blue-200">
          {truncate(url.fullUrl)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Short URL
        </span>
        <a
          href={`${shortDomain.replace(/\/$/, "")}/${url.shortUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-2 py-1 rounded bg-blue-700 text-white font-semibold text-sm dark:bg-blue-900"
          title={`${shortDomain.replace(/\/$/, "")}/${url.shortUrl}`}
        >
          {url.shortUrl}
        </a>
        <button
          onClick={handleCopy}
          title="Copy short URL"
          className="p-1 rounded transition bg-gray-200 hover:bg-blue-100 text-blue-700 dark:bg-gray-800 dark:hover:bg-blue-900 dark:text-blue-200"
        >
          {copied ? (
            <span className="text-blue-700 dark:text-blue-400 text-xs font-semibold">
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
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold shadow bg-blue-700 text-white dark:bg-blue-900">
          {url.clicks}
        </span>
      </div>
      {/* Bookmark info if exists */}
      {url.bookmark && (
        <div className="mt-2 p-2 rounded bg-blue-50 dark:bg-gray-900 border border-blue-200 dark:border-blue-800">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-blue-700 dark:text-blue-200 font-semibold">
              Connected Bookmark
            </span>
            <span className="font-bold text-blue-800 dark:text-blue-100">
              {url.bookmark.title}
            </span>
            <Link
              to={`/dashboard/#${url.bookmark.id}`}
              className="mt-2 inline-block px-3 py-1 rounded bg-blue-700 text-white font-semibold text-xs shadow hover:bg-gray-900 transition"
              style={{ textDecoration: "none" }}
            >
              Go to Bookmark
            </Link>
          </div>
        </div>
      )}
      <div className="flex gap-4 mt-4">
        <button
          onClick={handleEditClick}
          title="Edit"
          className="flex-1 h-10 px-3 py-1 rounded bg-blue-700 text-white text-base font-semibold hover:bg-gray-900 transition"
        >
          Edit
        </button>
        <button
          onClick={() => setOnDelete(true)}
          title="Delete"
          className="flex-1 h-10 px-3 py-1 rounded bg-red-500 text-white text-base font-semibold hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
export default ShortUrlCard;
