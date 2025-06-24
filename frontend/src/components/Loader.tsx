const Loader = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-blue-600 animate-pulse"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v4m0 8v4m8-8h-4m-8 0H4"
            />
          </svg>
        </div>
      </div>
      <span className="mt-6 text-blue-700 dark:text-blue-300 font-semibold text-lg animate-pulse">
        Loading SaifMarks...
      </span>
    </div>
  </div>
);
export default Loader;
