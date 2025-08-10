import { useDashboardContext } from "../../context";
import type { BookmarkProps } from "../../types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Bookmark = ({ bookmark, editFunction, setOnEdit }: BookmarkProps) => {
  const {
    handleDeleteBookmark,
    handleShortenBookmarkUrl,
    isShortUrlsLoading,
    shortDomain,
  } = useDashboardContext();

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [onDeleteError, setOnDeleteError] = useState<string>("");
  const [onDelete, setOnDelete] = useState<boolean>(false);
  const [deleteShorturls, setDeleteShorturls] = useState<boolean>(false);
  const [shortenLoading, setShortenLoading] = useState<boolean>(false);
  const [shortenError, setShortenError] = useState<string>("");
  const [showShortenInput, setShowShortenInput] = useState<boolean>(false);
  const [customShort, setCustomShort] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const bookmarkShortUrl = bookmark.shortUrl;

  // Highlight logic
  let highlightedId = "";
  if (typeof window !== "undefined") {
    const hash = window.location.hash;
    const match = hash.match(/#([a-z0-9]+)$/i);
    if (match) {
      highlightedId = match[1];
    }
  }
  const isHighlighted = bookmark.id === highlightedId;

  const highlightCard =
    "bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-blue-900 dark:via-gray-900 dark:to-blue-950 border-2 border-blue-400 dark:border-blue-700 shadow-lg";
  const highlightTitle = "text-blue-900 dark:text-blue-200";
  const highlightDesc = "text-blue-900 dark:text-blue-200";

  const deleteBookmark = async (bookmarkId: string) => {
    setDeleteLoading(true);
    try {
      await handleDeleteBookmark(bookmarkId, deleteShorturls);
    } catch (error: any) {
      setOnDeleteError(error.message);
    } finally {
      setDeleteLoading(false);
      setOnDelete(false);
    }
  };

  const handleShorten = async () => {
    setShortenLoading(true);
    setShortenError("");
    try {
      await handleShortenBookmarkUrl(bookmark.id, customShort || undefined);
      setShowShortenInput(false);
      setCustomShort("");
    } catch (error: any) {
      setShortenError(error.message || "Failed to create short URL");
    } finally {
      setShortenLoading(false);
    }
  };

  const handleCopy = () => {
    if (!bookmarkShortUrl) return;
    const shortUrl = `${shortDomain.replace(/\/$/, "")}/${
      bookmarkShortUrl.shortUrl
    }`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shortUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  useEffect(() => {
    if (!onDelete) setOnDeleteError("");
    if (onDelete) setOnEdit(false);
  }, [onDelete, setOnEdit]);

  if (onDelete) {
    return (
      <div
        className={`${
          isHighlighted ? highlightCard : "bg-white dark:bg-gray-900"
        } rounded-xl p-6 flex flex-col gap-2`}
      >
        <p className="font-bold text-red-700 dark:text-red-300 text-lg mb-5">
          Are you sure you want to delete this bookmark?
        </p>
        {bookmarkShortUrl && (
          <div className="mb-2">
            <label className="text-sm font-semibold text-blue-700 dark:text-blue-200 flex items-center gap-2">
              <input
                type="checkbox"
                checked={deleteShorturls}
                onChange={(e) => setDeleteShorturls(e.target.checked)}
                className="accent-blue-600 w-4 h-4"
              />
              Delete connected short URL also
            </label>
          </div>
        )}
        <div className="flex gap-4 mt-2">
          <button
            className="flex-1 h-10 px-3 py-1 rounded-xl bg-red-500 text-white text-base font-semibold hover:bg-red-600 transition"
            onClick={() => deleteBookmark(bookmark.id)}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Yes"}
          </button>
          <button
            className="flex-1 h-10 px-3 py-1 rounded-xl bg-blue-500 text-white text-base font-semibold hover:bg-blue-600 transition"
            onClick={() => setOnDelete(false)}
            disabled={deleteLoading}
          >
            No
          </button>
        </div>
        {onDeleteError && (
          <p className="text-red-500 text-xs mt-2">{onDeleteError}</p>
        )}
      </div>
    );
  }

  return (
    <div
      key={bookmark.id}
      className={`${
        isHighlighted ? highlightCard : "bg-white dark:bg-gray-900"
      } rounded-xl p-6 flex flex-col gap-2`}
    >
      <h3
        className={`font-bold text-lg ${
          isHighlighted ? highlightTitle : "text-blue-900 dark:text-blue-200"
        }`}
      >
        {bookmark.title}
      </h3>
      <div className="flex flex-col gap-1">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Short URL
        </span>
        {bookmarkShortUrl ? (
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-900 dark:text-blue-200">
              {bookmarkShortUrl.shortUrl}
            </span>
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
            <a
              href={`${shortDomain.replace(/\/$/, "")}/${
                bookmarkShortUrl.shortUrl
              }`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-2 py-1 rounded bg-blue-700 text-white font-semibold text-sm dark:bg-blue-900"
              title={`${shortDomain.replace(/\/$/, "")}/${
                bookmarkShortUrl.shortUrl
              }`}
            >
              View
            </a>
          </div>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">No short URL</span>
        )}
      </div>
      <div className="flex flex-col gap-1 mt-2">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Full URL
        </span>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-900 dark:text-blue-200 underline break-all"
          title={bookmark.url}
        >
          {bookmark.url}
        </a>
      </div>
      {bookmark.description && (
        <p
          className={`mt-2 ${
            isHighlighted ? highlightDesc : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {bookmark.description}
        </p>
      )}

      {/* Connected Short URL block above buttons */}
      {bookmarkShortUrl && (
        <div className="mt-2 mb-2 p-2 rounded bg-blue-50 dark:bg-gray-900 border border-blue-200 dark:border-blue-800">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-blue-700 dark:text-blue-200 font-semibold">
              Connected Short URL
            </span>
            <span className="font-bold text-blue-900 dark:text-blue-100">
              {bookmarkShortUrl.shortUrl}
            </span>
            <Link
              to={`/shorturls/#${bookmarkShortUrl.id}`}
              className="mt-2 inline-block px-3 py-1 rounded bg-blue-700 text-white font-semibold text-xs shadow hover:bg-gray-900 transition"
              style={{ textDecoration: "none" }}
            >
              Go to Short URL
            </Link>
          </div>
        </div>
      )}

      {/* Short URL Section */}
      <div className="mt-2">
        {!bookmarkShortUrl && showShortenInput ? (
          <div className="flex flex-col gap-2 mt-2">
            <input
              type="text"
              className="w-full px-3 py-2 rounded border border-blue-200 dark:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 bg-gray-50 dark:bg-gray-800 text-black dark:text-white transition"
              placeholder="Custom short code (optional)"
              value={customShort}
              onChange={(e) => setCustomShort(e.target.value)}
              disabled={shortenLoading}
            />
            <div className="flex gap-2">
              <button
                className="flex-1 px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition"
                onClick={handleShorten}
                disabled={shortenLoading || isShortUrlsLoading}
                type="button"
              >
                {shortenLoading || isShortUrlsLoading
                  ? "Creating..."
                  : "Create Short URL"}
              </button>
              <button
                className="flex-1 px-3 py-1 rounded bg-gray-400 text-white text-xs font-semibold hover:bg-gray-500 transition"
                onClick={() => {
                  setShowShortenInput(false);
                  setCustomShort("");
                }}
                type="button"
                disabled={shortenLoading || isShortUrlsLoading}
              >
                Cancel
              </button>
            </div>
            {shortenError && (
              <p className="text-red-500 text-xs mt-2">{shortenError}</p>
            )}
          </div>
        ) : !bookmarkShortUrl ? (
          <button
            className="mt-2 px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition"
            onClick={() => setShowShortenInput(true)}
            disabled={isShortUrlsLoading}
            type="button"
          >
            Create Short URL
          </button>
        ) : null}
      </div>

      <div className="flex gap-4 mt-4">
        <button
          className="flex-1 h-10 px-3 py-1 rounded bg-blue-700 text-white text-base font-semibold hover:bg-gray-900 transition"
          onClick={() => {
            editFunction(bookmark);
            setOnEdit(true);
          }}
        >
          Edit
        </button>
        <button
          className="flex-1 h-10 px-3 py-1 rounded bg-red-500 text-white text-base font-semibold hover:bg-red-600 transition"
          onClick={() => setOnDelete(true)}
        >
          {deleteLoading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};
export default Bookmark;
