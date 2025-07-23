import { useDashboardContext } from "../context/DashboardContext";
import { FaSun, FaMoon, FaDesktop } from "react-icons/fa";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useDashboardContext();

  let icon;
  let label;
  if (theme === "light") {
    icon = <FaSun className="text-yellow-500" />;
    label = "Light";
  } else if (theme === "dark") {
    icon = <FaMoon className="text-blue-400" />;
    label = "Dark";
  } else {
    icon = <FaDesktop className="text-gray-700 dark:text-gray-300" />;
    label = "System";
  }

  return (
    <button
      onClick={toggleTheme}
      className="ml-4 p-2 rounded-full bg-blue-100 dark:bg-gray-800 hover:bg-blue-200 dark:hover:bg-gray-700 transition flex items-center gap-2"
      aria-label="Toggle theme"
      title={`Switch theme (${label})`}
    >
      <span className="text-xl">{icon}</span>
      <span className="hidden sm:inline text-xs font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </button>
  );
};

export default ThemeToggle;
