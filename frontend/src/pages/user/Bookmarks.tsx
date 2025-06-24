import { useDashboardContext } from "../../context/DashboardContext";
import DashboardLayout from "../../layouts/DashboardLayout";
import BookmarksContent from "./BookmarksContent";

const BookmarksPage = () => {
  const { bookmarks } = useDashboardContext();
  const handleEdit = (id: string) => {
    // Implement edit logic
    console.log(`Edit bookmark with id: ${id}`);
  };
  const handleDelete = (id: string) => {
    // Implement delete logic
    console.log(`Delete bookmark with id: ${id}`);
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
