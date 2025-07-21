import { Navigate } from "react-router-dom";
import { useDashboardContext } from "../../context/DashboardContext";
import Loader from "../../components/Loader";

function VerifyRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isUserLoading, isVerified } = useDashboardContext();

  if (isUserLoading) {
    return <Loader />;
  }

  if (isAuthenticated && isVerified) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}
export default VerifyRoute;
