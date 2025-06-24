import { Navigate } from "react-router-dom";
import { useDashboardContext } from "../../context/DashboardContext";
import Loader from "../../components/Loader";

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isUserLoading } = useDashboardContext();

  if (isUserLoading) {
    return <Loader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
export default AuthRoute;
