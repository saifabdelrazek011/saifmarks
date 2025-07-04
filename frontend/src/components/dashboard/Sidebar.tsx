import { Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import SignoutBtn from "../SignoutBtn";

const Sidebar = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  // Sidebar content as a component for reuse
  const SidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-8">
          Saif<span className="text-blue-500 dark:text-blue-300">Marks</span>
        </h2>
        <nav className="flex flex-col gap-4">
          <Link
            to="/dashboard"
            className="text-blue-700 dark:text-blue-300 font-semibold hover:bg-blue-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition"
            onClick={() => setOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/bookmarks"
            className="text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition"
            onClick={() => setOpen(false)}
          >
            Bookmarks
          </Link>
          <Link
            to="/settings"
            className="text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-800 rounded-lg px-3 py-2 transition"
            onClick={() => setOpen(false)}
          >
            Settings
          </Link>
        </nav>
      </div>
      <div className="flex flex-col gap-4 mt-8">
        <SignoutBtn onAfterSignout={() => setOpen(false)} />
      </div>
    </div>
  );

  return (
    <>
      {/* Sidebar for medium and up */}
      <aside className="hidden md:flex w-64 bg-white/90 dark:bg-gray-900/90 shadow-lg flex-col justify-between py-8 px-6 min-h-screen">
        {SidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setOpen(false)}
          />
          {/* Sidebar */}
          <aside className="relative w-64 bg-white dark:bg-gray-900 shadow-lg flex flex-col justify-between py-8 px-6 min-h-screen z-50 animate-slide-in-left">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-blue-600 text-white shadow focus:outline-none"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
            >
              <FiX size={24} />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
