import { Link } from "react-router-dom";
import { useDashboardContext } from "../context";
import Navbar from "../components/Navbar";

const Home = () => {
  const { isAuthenticated } = useDashboardContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      {/* Header */}
      <Navbar />

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
