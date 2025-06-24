import DashboardLayout from "../../layouts/DashboardLayout";

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
          Welcome to your Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Here you can manage your bookmarks, profile, and settings.
        </p>
      </div>
    </DashboardLayout>
  );
}
export default Dashboard;
