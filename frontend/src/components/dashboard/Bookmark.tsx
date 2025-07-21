import { useDashboardContext } from "../../context";
import type { BookmarkProps } from "../../types";
import { useEffect, useState } from "react";

const Bookmark = ({ bookmark, editFunction, setOnEdit }: BookmarkProps) => {
  const { handleDeleteBookmark } = useDashboardContext();
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [onDeleteError, setDeleteError] = useState<string>("");
  const [onDelete, setOnDelete] = useState<boolean>(false);

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
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col gap-2">
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

    // If onDelete is false, render the bookmark details
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
        {bookmark.description && (
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            {bookmark.description}
          </p>
        )}

        <div className="flex gap-2 mt-4">
          <button
            className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition"
            onClick={() => editFunction(bookmark)}
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
