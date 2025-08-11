import { Link } from "react-router-dom";
import { useDashboardContext } from "../context";
import ToggleTheme from "../components/ThemeToggle";
function NavBar({ hideContact = false }) {
  const { isAuthenticated, isAppLoading } = useDashboardContext();
  return (
    <header className="flex justify-between items-center px-8 py-6 bg-white/80 dark:bg-gray-900/80 shadow-md backdrop-blur-md">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 tracking-tight">
        <Link to="/">
          Saif
          <span className="text-blue-500 dark:text-blue-300">Marks</span>
        </Link>
      </h1>
      <div className="flex items-center space-x-4">
        <ToggleTheme />
        {/* Contact form */}
        {!hideContact ? (
          <Link
            to="/contact"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition"
          >
            Contact
          </Link>
        ) : (
          <Link
            to="/"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition"
          >
            Home
          </Link>
        )}
        {isAppLoading ? (
          <button
            disabled
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow flex items-center gap-2 opacity-70 cursor-not-allowed"
          >
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Loading...
          </button>
        ) : isAuthenticated ? (
          <Link
            to="/dashboard"
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition"
          >
            Dashboard
          </Link>
        ) : (
          <>
            <Link
              to="/signin"
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-300 text-white font-semibold shadow hover:scale-105 hover:from-blue-500 hover:to-blue-400 transition"
            >
              Login
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default NavBar;
