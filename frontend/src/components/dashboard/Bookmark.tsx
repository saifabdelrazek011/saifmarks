import { useDashboardContext } from "../../context";
import type { BookmarkProps } from "../../types";
import { useState } from "react";

const Bookmark = ({ bookmark, onEdit }: BookmarkProps) => {
  const { handleDeleteBookmark } = useDashboardContext();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [onDeleteError, setDeleteError] = useState<string>("");

  const deleteBookmark = (bookmarkId: string) => {
    setDeleteLoading(true);
    try {
      handleDeleteBookmark(bookmarkId);
    } catch (error: any) {
      setDeleteError(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };
  if (bookmark)
    return (
      <div
        key={bookmark.id}
        className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col gap-2"
      >
        <h3 className="font-bold text-blue-700 dark:text-blue-300 text-lg">
          {bookmark.title}
        </h3>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline break-all"
        >
          {bookmark.url}
        </a>
        <div className="flex gap-2 mt-2 flex-wrap">
          {bookmark.tags &&
            bookmark.tags.map((tag) => (
              <span
                key={tag}
                className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 px-2 py-1 rounded text-xs font-semibold"
              >
                #{tag}
              </span>
            ))}
        </div>
        {bookmark.description && (
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            {bookmark.description}
          </p>
        )}
        {onDeleteError && (
          <p className="text-red-500 text-xs mt-2">{onDeleteError}</p>
        )}

        <div className="flex gap-2 mt-4">
          {onEdit && (
            <button
              className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition"
              onClick={() => onEdit(bookmark)}
            >
              Edit
            </button>
          )}
          <button
            className="px-3 py-1 rounded bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition"
            onClick={() => deleteBookmark(bookmark.id)}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    );
};

export default Bookmark;
