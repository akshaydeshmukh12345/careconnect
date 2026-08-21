import AdminRoute from "./AdminRoute";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

import Home from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import Doctors from "../pages/Doctors/Doctors";
import Appointments from "../pages/Appointments/Appointments";
import Profile from "../pages/Profile/Profile";
import Settings from "../pages/Settings/Settings";
import DoctorDashboard from "../pages/DoctorDashboard/DoctorDashboard";
import AIWellness from "../pages/AIWellness/AIWellness";
import HealthProfile from "../pages/HealthProfile/HealthProfile";
import NotFound from "../pages/NotFound/NotFound";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<AdminRoute />}>
  <Route
    path="/admin/dashboard"
    element={<AdminDashboard />}
  />
</Route>

        {/* =========================
            MAIN LAYOUT
        ========================= */}

        <Route element={<MainLayout />}>

          {/* =========================
              PUBLIC ROUTES
          ========================= */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/doctors"
            element={<Doctors />}
          />

          {/* =========================
              PROTECTED ROUTES
          ========================= */}

          <Route element={<ProtectedRoute />}>

            {/* Patient / Common */}

            <Route
              path="/appointments"
              element={<Appointments />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

            {/* Health Profile */}

            <Route
              path="/health-profile"
              element={<HealthProfile />}
            />

            {/* AI Wellness */}

            <Route
              path="/ai-wellness"
              element={<AIWellness />}
            />

            {/* Doctor Dashboard */}

            <Route
              path="/doctor-dashboard"
              element={<DoctorDashboard />}
            />

          </Route>

          {/* =========================
              404
          ========================= */}

          <Route
            path="*"
            element={<NotFound />}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;