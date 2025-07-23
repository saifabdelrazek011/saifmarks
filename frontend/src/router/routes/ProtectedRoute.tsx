import { useDashboardContext } from "../../context/DashboardContext";
import { Navigate } from "react-router-dom";
import Loader from "../../components/Loader";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAppLoading, isVerified } = useDashboardContext();

  if (isAppLoading) {
    return <Loader />;
  }

  if (!isVerified) {
    return (
      <Navigate
        to="/verify"
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
