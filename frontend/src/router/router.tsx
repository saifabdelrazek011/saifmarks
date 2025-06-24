import { HashRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Notfound from "../pages/404";
import Signin from "../pages/auth/Signin";
import Signup from "../pages/auth/Signup";
import ForgotPassword from "../pages/auth/ForgotPassword";
import About from "../pages/static/About";
import Contact from "../pages/static/Contact";
import Help from "../pages/static/Help";
import Policy from "../pages/static/Policy";
import Terms from "../pages/static/Terms";
import Dashboard from "../pages/user/Dashboard";
import Profile from "../pages/user/Profile";
import Settings from "../pages/user/Settings";
import Developer from "../pages/user/Developer";
import ProtectedRoute from "./routes/ProtectedRoute";
import AuthRoute from "./routes/AuthRoute";
import RouteTracker from "./RouteTracker";
import BookmarksPage from "../pages/user/Bookmarks";

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
          {/* User Routes */}
          <Route
            path="/bookmarks"
            element={
              <ProtectedRoute>
                <BookmarksPage />
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
            path="/forgot-password"
            element={
              <AuthRoute>
                <ForgotPassword />
              </AuthRoute>
            }
          />

          {/* Static Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Policy />} />

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
