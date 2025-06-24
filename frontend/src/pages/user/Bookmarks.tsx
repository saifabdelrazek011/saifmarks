import { useDashboardContext } from "../../context/DashboardContext";
import DashboardLayout from "../../layouts/DashboardLayout";
import BookmarksContent from "./BookmarksContent";

const BookmarksPage = () => {
  const { bookmarks } = useDashboardContext();

  // Optionally, add handlers for edit/delete here
  const handleEdit = (id: string) => {
    // Implement edit logic or open edit modal
  };

  const handleDelete = (id: string) => {
    // Implement delete logic
  };

  return (
    <DashboardLayout>
      <BookmarksContent
        bookmarks={bookmarks}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </DashboardLayout>
  );
};
export default BookmarksPage;
