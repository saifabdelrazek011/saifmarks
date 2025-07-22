import { useDashboardContext } from "../../context";
import type { BookmarkProps } from "../../types";
import { useEffect, useState } from "react";

const Bookmark = ({ bookmark, editFunction, setOnEdit }: BookmarkProps) => {
  const { handleDeleteBookmark, handleShortenBookmarkUrl, isShortUrlsLoading } =
    useDashboardContext();

  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [onDeleteError, setDeleteError] = useState<string>("");
  const [onDelete, setOnDelete] = useState<boolean>(false);
  const [shortenLoading, setShortenLoading] = useState<boolean>(false);
  const [shortenError, setShortenError] = useState<string>("");
  const [showShortenInput, setShowShortenInput] = useState<boolean>(false);
  const [customShort, setCustomShort] = useState<string>("");

  // Use the shortUrl directly from the bookmark object
  const bookmarkShortUrl = bookmark.shortUrl;

  // Get the bookmark id from the hash URL (for HashRouter)
  let highlightedId = "";
  if (typeof window !== "undefined") {
    const hash = window.location.hash;
    const match = hash.match(/#([a-z0-9]+)$/i);
    if (match) {
      highlightedId = match[1];
    }
  }
  const isHighlighted = bookmark.id === highlightedId;

  // Styles for highlighted bookmark
  const highlightCard =
    "bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-blue-900 dark:via-gray-900 dark:to-blue-950 border-2 border-blue-400 dark:border-blue-700 shadow-lg";
  const highlightTitle = "text-blue-900 dark:text-blue-200";
  const highlightText = "text-blue-800 dark:text-blue-100";
  const highlightDesc = "text-blue-900 dark:text-blue-200";

  const deleteBookmark = (bookmarkId: string) => {
    setDeleteLoading(true);
    try {
      handleDeleteBookmark(bookmarkId);
    } catch (error: any) {
      console.error(error);
      setDeleteError(error.message);
    } finally {
      setDeleteLoading(false);
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

  useEffect(() => {
    // Reset delete state when onDelete changes
    if (!onDelete) {
      setDeleteError("");
    }
    if (onDelete) {
      setOnEdit(false);
    }
  }, [onDelete]);

  if (bookmark) {
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
          <button
            className="px-3 py-1.5 rounded-xl bg-red-500  text-white text-xs font-semibold hover:bg-red-600 transition"
            onClick={() => deleteBookmark(bookmark.id)}
          >
            Yes
          </button>
          <button
            className="px-3 py-1.5 rounded-xl bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition"
            onClick={() => setOnDelete(false)}
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
      <div
        key={bookmark.id}
        className={`${
          isHighlighted ? highlightCard : "bg-white dark:bg-gray-900"
        } rounded-xl p-6 flex flex-col gap-2`}
      >
        <h3
          className={`font-bold text-lg ${
            isHighlighted ? highlightTitle : "text-blue-700 dark:text-blue-300"
          }`}
        >
          {bookmark.title}
        </h3>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`hover:underline break-all ${
            isHighlighted ? highlightText : "text-blue-500"
          }`}
        >
          {bookmark.url}
        </a>
        {bookmark.description && (
          <p
            className={`mt-2 ${
              isHighlighted ? highlightDesc : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {bookmark.description}
          </p>
        )}

        {/* Short URL Section */}
        <div className="mt-2">
          {bookmarkShortUrl ? (
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Short URL
              </span>
              <a
                href={`${window.location.origin}/s/${bookmarkShortUrl.shortUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-2 py-1 rounded bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold text-sm dark:from-blue-900 dark:to-blue-400"
                title={`${window.location.origin}/s/${bookmarkShortUrl.shortUrl}`}
              >
                {bookmarkShortUrl.shortUrl}
              </a>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Clicks:{" "}
                <span className="font-bold text-blue-700 dark:text-blue-300">
                  {bookmarkShortUrl.clicks}
                </span>
              </span>
            </div>
          ) : showShortenInput ? (
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
                  className="flex-1 px-3 py-1 rounded bg-green-500 text-white text-xs font-semibold hover:bg-green-600 transition"
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
          ) : (
            <button
              className="mt-2 px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition"
              onClick={() => setShowShortenInput(true)}
              disabled={isShortUrlsLoading}
              type="button"
            >
              Create Short URL
            </button>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition"
            onClick={() => {
              editFunction(bookmark);
              setOnEdit(true);
            }}
          >
            Edit
          </button>
          <button
            className="px-3 py-1 rounded bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition"
            onClick={() => setOnDelete(true)}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    );
  }
};
export default Bookmark;
