import DashboardLayout from "../../layouts/DashboardLayout";
import { useDashboardContext } from "../../context";

const availableShortDomains = import.meta.env.VITE_AVAILABLE_SHORT_DOMAINS
  ? import.meta.env.VITE_AVAILABLE_SHORT_DOMAINS.split(",")
  : ["go.died.pw"];

function Settings() {
  const {
    hideWelcome,
    setHideWelcome,
    theme,
    toggleTheme,
    shortDomain,
    setShortDomain,
  } = useDashboardContext();

  return (
    <DashboardLayout>
      <div className="max-w-xl mx-auto mt-8 bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-200 mb-4">
          Settings
        </h2>

        {/* Hide Welcome */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            Hide Welcome Message
          </span>
          <input
            type="checkbox"
            checked={hideWelcome}
            onChange={(e) => setHideWelcome(e.target.checked)}
            className="w-5 h-5 accent-blue-600"
          />
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-700 dark:text-gray-200">
            Theme
          </span>
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded bg-blue-100 dark:bg-gray-800 text-black dark:text-white font-semibold"
          >
            {theme === "light"
              ? "Switch to Dark"
              : theme === "dark"
              ? "Switch to System"
              : "Switch to Light"}
          </button>
        </div>

        {/* Preferred Short URL Domain */}
        <div className="flex flex-col gap-2">
          <label className="font-semibold text-gray-700 dark:text-gray-200">
            Preferred Short URL Domain
          </label>
          <select
            value={shortDomain}
            onChange={(e) => setShortDomain(e.target.value)}
            className="px-4 py-2 rounded border border-blue-200 dark:border-blue-700 bg-gray-50 dark:bg-gray-800 text-black dark:text-white"
          >
            {availableShortDomains.map((domain: string) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Example: go.died.pw
          </span>
        </div>
      </div>
    </DashboardLayout>
  );
}
export default Settings;
