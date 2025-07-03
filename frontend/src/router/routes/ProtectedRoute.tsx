import { useDashboardContext } from "../../context/DashboardContext";
import { Navigate } from "react-router-dom";
import Loader from "../../components/Loader";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isUserLoading } = useDashboardContext();

  if (isUserLoading) {
    return <Loader />;
  }
  if (!isAuthenticated) {
    setTimeout(() => <Navigate to="/signin" replace />, 100);
  }

  return <>{children}</>;
}

export default ProtectedRoute;
