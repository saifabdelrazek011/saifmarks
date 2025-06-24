import { Link } from "react-router-dom";

function Notfound() {
  const lastValidRoute = localStorage.getItem("lastValidRoute") || "/";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <h1 className="text-6xl font-extrabold text-blue-700 dark:text-blue-400 mb-4">
        404
      </h1>
      <p className="text-xl text-gray-700 dark:text-gray-200 mb-8">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to={lastValidRoute}
        className="px-6 py-3 rounded-full bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition"
      >
        Go Back
      </Link>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Or return to the{" "}
        <Link to="/" className="text-blue-600 hover:underline">
          homepage
        </Link>
        .
      </p>
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
        If you think this is an error, please contact support.
      </p>
    </div>
  );
}
export default Notfound;
