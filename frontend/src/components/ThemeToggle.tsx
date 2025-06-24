// Place this in your Navbar or wherever you want the theme toggle button
import { useDashboardContext } from "../context/DashboardContext";

const ThemeToggle = () => {
  const { toggleTheme } = useDashboardContext();

  return (
    <button
      onClick={toggleTheme}
      className="ml-4 p-2 rounded-full bg-blue-100 dark:bg-gray-800 hover:bg-blue-200 dark:hover:bg-gray-700 transition"
      aria-label="Toggle theme"
      title="Toggle light/dark mode"
    >
      <span className="text-xl">
        {/* Sun for light, moon for dark (Tailwind handles color) */}
        <svg
          className="w-6 h-6 text-yellow-500 dark:text-blue-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            className="block dark:hidden"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M12 7a5 5 0 100 10 5 5 0 000-10z"
          />
          <path
            className="hidden dark:block"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
          />
        </svg>
      </span>
    </button>
  );
};

export default ThemeToggle;
