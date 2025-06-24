import React from "react";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  tags?: string[];
};

type BookmarksProps = {
  bookmarks: Bookmark[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const Bookmark: React.FC<BookmarksProps> = ({
  bookmarks,
  onEdit,
  onDelete,
}) => {
  if (!bookmarks.length) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        No bookmarks yet. Start adding your favorite links!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookmarks.map((bookmark) => (
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
          <div className="flex gap-2 mt-4">
            {onEdit && (
              <button
                className="px-3 py-1 rounded bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 transition"
                onClick={() => onEdit(bookmark.id)}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                className="px-3 py-1 rounded bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition"
                onClick={() => onDelete(bookmark.id)}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Bookmark;
