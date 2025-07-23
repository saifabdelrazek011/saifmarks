import { useDashboardContext } from "../../context";
import ThemeToggle from "../ThemeToggle";
import { FiMenu } from "react-icons/fi";
import { Link } from "react-router-dom";

const Navbar = ({ onSidebarOpen }: { onSidebarOpen?: () => void }) => {
  const { user } = useDashboardContext();

  return (
    <header className="w-full flex items-center justify-between px-4 md:px-10 py-6 bg-white/80 dark:bg-gray-900/80 shadow-md backdrop-blur-md">
      {/* Hamburger for small screens */}
      {onSidebarOpen && (
        <button
          className="md:hidden p-2 rounded-full bg-blue-600 text-white shadow-lg focus:outline-none mr-2"
          onClick={onSidebarOpen}
          aria-label="Open sidebar"
        >
          <FiMenu size={24} />
        </button>
      )}
      <h1 className="text-2xl md:text-3xl font-bold text-blue-700 dark:text-blue-400">
        Welcome{user?.firstName ? `, ${user.firstName}` : ""}!
      </h1>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link
          to="/contact"
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md font-medium shadow hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
          title="Contact Us"
        >
          Contact Us
        </Link>
        <Link to="/profile" title="Profile">
          <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-xl shadow hover:ring-2 hover:ring-blue-500 transition">
            {user?.firstName ? user.firstName[0].toUpperCase() : "U"}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;
