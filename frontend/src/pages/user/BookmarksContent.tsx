import Bookmark from "../../components/dashboard/Bookmark";

type BookmarkType = {
  id: string;
  title: string;
  url: string;
  tags?: string[];
};

type BookmarksContentProps = {
  bookmarks: BookmarkType[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

const BookmarksContent: React.FC<BookmarksContentProps> = ({
  bookmarks,
  onEdit,
  onDelete,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300">
          Your Bookmarks
        </h2>
        {/* Optionally, add a button to add a new bookmark */}
        <button className="px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
          + Add Bookmark
        </button>
      </div>
      {/* Optionally, add search/filter UI here */}
      <Bookmark bookmarks={bookmarks} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};

export default BookmarksContent;
