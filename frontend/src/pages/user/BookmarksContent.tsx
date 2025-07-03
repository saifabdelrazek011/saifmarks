import { useEffect, useState } from "react";
import Bookmark from "../../components/dashboard/Bookmark";
import { useDashboardContext } from "../../context";
import type { BookmarkType } from "../../types";

const BookmarksContent = () => {
  const { bookmarks, handleAddBookmark, handleEditBookmark } =
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
    tags: [],
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
      setTimeout(() => {
        setOnCreateError("");
      });
    }
  }, [onCreateError]);

  return (
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
            className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition"
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
      {onCreate && !onEdit ? (
        <div>
          <form
            action={async (formData) => {
              setIsCreateLoading(true);
              try {
                const formDataObject: Omit<BookmarkType, "id"> = {
                  title: formData.get("title") as string,
                  url: formData.get("url") as string,
                  tags: formData
                    .get("tags")
                    ?.toString()
                    .split(",")
                    .map((tag) => tag.trim()),
                  description: formData.get("description") as string,
                };

                await handleAddBookmark(formDataObject);
              } catch (error: any) {
                setOnCreateError(error.message);
              } finally {
                setIsCreateLoading(false);
              }
            }}
          >
            {onCreateError ? (
              <div className="text-red-600">{onCreateError}</div>
            ) : (
              ""
            )}

            <label htmlFor="title">Title: </label>
            <input
              name="title"
              id="title"
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 
                dark:bg-gray-800 dark:text-white dark:border-blue-900 dark:focus:ring-blue-500
                   bg-white text-black border-blue-200 focus:ring-blue-400
              `}
              type="text"
              placeholder="Bookmark Title"
            />
            <label htmlFor="url">URL: </label>
            <input
              name="url"
              id="url"
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 
                dark:bg-gray-800 dark:text-white dark:border-blue-900 dark:focus:ring-blue-500
                   bg-white text-black border-blue-200 focus:ring-blue-400
              `}
              type="url"
              placeholder="Bookmark URL"
            />
            <label htmlFor="description">Description: </label>
            <input
              name="description"
              id="descrition"
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 
                dark:bg-gray-800 dark:text-white dark:border-blue-900 dark:focus:ring-blue-500
                   bg-white text-black border-blue-200 focus:ring-blue-400
              `}
              type="text"
              placeholder="Description of the bookmark (Optional)"
            />
            <label htmlFor="tags">Tags: </label>
            <input
              name="tags"
              id="tags"
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 
                dark:bg-gray-800 dark:text-white dark:border-blue-900 dark:focus:ring-blue-500
                   bg-white text-black border-blue-200 focus:ring-blue-400
              `}
              type="text"
              placeholder="Comma separated tags (e.g. tag1, tag2) (Optional)"
            />
            <button
              type="submit"
              className="w-full my-10 rounded-2xl py-3 bg-blue-600 text-white"
            >
              Create
            </button>
          </form>
        </div>
      ) : (
        ""
      )}
      {onEdit ? (
        <div>
          <form
            action={async (formData) => {
              setIsEditLoading(true);
              try {
                const formDataObject: {
                  id: string;
                  title: string;
                  url: string;
                  description: string;
                } = {
                  id: formData.get("id") as string,
                  title: formData.get("title") as string,
                  url: formData.get("url") as string,
                  description: formData.get("description") as string,
                };

                await handleEditBookmark(formDataObject);
              } catch (error: any) {
                setOnEditError(error.message);
              } finally {
                setIsEditLoading(false);
              }
            }}
          >
            {onEditError ? (
              <div className="text-red-600">{onEditError}</div>
            ) : (
              ""
            )}
            <input type="hidden" name="id" value={editBookmarkData.id} />
            <label htmlFor="title">Title: </label>
            <input
              name="title"
              id="title"
              value={editBookmarkData.title}
              onChange={handleEditDataChange}
              placeholder="Bookmark Title"
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 
                dark:bg-gray-800 dark:text-white dark:border-blue-900 dark:focus:ring-blue-500
                   bg-white text-black border-blue-200 focus:ring-blue-400
              `}
              type="text"
            />
            <label htmlFor="url">URL: </label>
            <input
              name="url"
              id="url"
              value={editBookmarkData.url}
              onChange={handleEditDataChange}
              placeholder="Bookmark URL"
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 
                dark:bg-gray-800 dark:text-white dark:border-blue-900 dark:focus:ring-blue-500
                   bg-white text-black border-blue-200 focus:ring-blue-400
              `}
              type="url"
            />
            <label htmlFor="description">Description: </label>
            <input
              name="description"
              id="description"
              placeholder="Description of the bookmark (Optional)"
              value={editBookmarkData.description}
              onChange={handleEditDataChange}
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 
                dark:bg-gray-800 dark:text-white dark:border-blue-900 dark:focus:ring-blue-500
                   bg-white text-black border-blue-200 focus:ring-blue-400
              `}
              type="text"
            />
            <label htmlFor="tags">Tags: </label>
            <input
              name="tags"
              id="tags"
              placeholder="Comma separated tags (e.g. tag1, tag2) (Optional)"
              value={editBookmarkData?.tags?.join(",")}
              onChange={(e) =>
                setEditBookmarkData({
                  ...editBookmarkData,
                  tags: e.target.value.split(",").map((tag) => tag.trim()),
                })
              }
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 
                dark:bg-gray-800 dark:text-white dark:border-blue-900 dark:focus:ring-blue-500
                   bg-white text-black border-blue-200 focus:ring-blue-400`}
            />
            <button
              type="submit"
              className="w-full my-10 rounded-2xl py-3 bg-blue-600 text-white"
            >
              {isEditLoading ? "Editing..." : "Edit"}
            </button>
          </form>
        </div>
      ) : (
        ""
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((bookmark) => (
          <Bookmark bookmark={bookmark} onEdit={setEditBookmarkState} />
        ))}
      </div>
    </div>
  );
};

export default BookmarksContent;
