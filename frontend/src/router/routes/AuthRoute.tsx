import { Navigate } from "react-router-dom";
import { useDashboardContext } from "../../context";
import Loader from "../../components/Loader";

function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAppLoading, isVerified } = useDashboardContext();

  if (isAppLoading) {
    return <Loader />;
  }

  if (isAuthenticated && !isVerified) {
    return (
      <Navigate
        to="/verify"
        replace
        state={{ from: window.location.pathname }}
      />
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
export default AuthRoute;
