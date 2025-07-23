import { Link } from "react-router-dom";
import { useDashboardContext } from "../context";
import ToggleTheme from "../components/ThemeToggle";

const Home = () => {
  const { isAuthenticated, isAppLoading } = useDashboardContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6 bg-white/80 dark:bg-gray-900/80 shadow-md backdrop-blur-md">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 tracking-tight">
          Saif<span className="text-blue-500 dark:text-blue-300">Marks</span>
        </h1>
        <div className="flex items-center space-x-4">
          <ToggleTheme />
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
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow hover:scale-105 hover:from-blue-700 hover:to-blue-500 transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-400 to-blue-300 text-white font-semibold shadow hover:scale-105 hover:from-blue-500 hover:to-blue-400 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-800 dark:text-blue-300">
          A safe place to save your bookmarks.
        </h2>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-200 mb-8 max-w-xl">
          SaifMarks helps you organize, save, and access your favorite links
          securely from anywhere.
        </p>
        <Link
          to={isAuthenticated ? "/dashboard" : "/signup"}
          className="inline-block px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white font-bold text-lg shadow-lg hover:scale-105 transition"
        >
          Get Started
        </Link>
        <a
          href="https://github.com/saifabdelrazek011/saifmarks"
          className="mt-6 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-300 transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          Star the project on GitHub
        </a>
        <div className="mt-8 text-gray-600 dark:text-gray-400">
          <p>
            Made with ❤️ by{" "}
            <a
              href="https://github.com/saifabdelrazek011"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              className="text-blue-600 dark:text-blue-300 hover:underline"
            >
              Saif Abdelrazek
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} SaifMarks. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
