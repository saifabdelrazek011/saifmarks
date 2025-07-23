import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Notfound from "../pages/404";
import Signin from "../pages/auth/Signin";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Contact from "../pages/static/Contact";
import Dashboard from "../pages/user/Dashboard";
import Profile from "../pages/user/Profile";
import Settings from "../pages/user/Settings";
import Developer from "../pages/user/Developer";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthRoute from "./routes/AuthRoute";
import RouteTracker from "./RouteTracker";
import Verify from "../pages/auth/Verify";
import VerifyRoute from "./routes/VerifyRoute";
import ShortUrls from "../pages/user/ShortUrls";

function Router() {
  return (
    <>
      <HashRouter>
        <RouteTracker />
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shorturls"
            element={
              <ProtectedRoute>
                <ShortUrls />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          {/*Auth Routes*/}
          <Route
            path="/signin"
            element={
              <AuthRoute>
                <Signin />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <Signup />
              </AuthRoute>
            }
          />
          <Route
            path="/verify"
            element={
              <VerifyRoute>
                <Verify />
              </VerifyRoute>
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Static Pages */}
          <Route path="/contact" element={<Contact />} />

          {/* Developer Routes */}
          <Route
            path="/developer"
            element={
              <ProtectedRoute>
                <Developer />
              </ProtectedRoute>
            }
          />

          {/* Catch-all Route for 404 */}
          <Route path="*" element={<Notfound />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default Router;
