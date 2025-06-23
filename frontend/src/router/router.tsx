import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
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

function Router() {
  return (
    <>
      <HashRouter>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          {/*Auth Routes*/}
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Static Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Policy />} />
          <Route path="/404" element={<Notfound />} />

          {/* Developer Routes */}
          <Route path="/developer" element={<Developer />} />

          {/* Catch-all Route for 404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </HashRouter>
    </>
  );
}

export default Router;
