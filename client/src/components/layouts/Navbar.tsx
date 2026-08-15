import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Logo from "./Logo";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMobileMenu}
          className="shrink-0"
        >
          <Logo />
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================= */}
        <nav className="hidden items-center gap-6 lg:flex">

          <Link
            to="/"
            className="whitespace-nowrap font-medium text-slate-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/doctors"
            className="whitespace-nowrap font-medium text-slate-700 transition hover:text-blue-600"
          >
            Doctors
          </Link>

          <Link
            to="/appointments"
            className="whitespace-nowrap font-medium text-slate-700 transition hover:text-blue-600"
          >
            Appointments
          </Link>

          {isAuthenticated && (
            <Link
              to="/profile"
              className="whitespace-nowrap font-medium text-slate-700 transition hover:text-blue-600"
            >
              Profile
            </Link>
          )}

          {/* AI WELLNESS */}
          {isAuthenticated && (
            <Link
              to="/ai-wellness"
              className="flex items-center gap-1 whitespace-nowrap font-semibold text-blue-600 transition hover:text-blue-700"
            >
              🤖 CareConnect AI
            </Link>
          )}
        </nav>

        {/* =========================
            DESKTOP AUTH
        ========================= */}
        <div className="hidden items-center gap-2 xl:flex">

          {isAuthenticated ? (
            <>
              <span className="max-w-[140px] truncate text-sm text-slate-600">
                Hi, {user?.name}
              </span>

              <button
                onClick={() => navigate("/settings")}
                className="whitespace-nowrap rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="whitespace-nowrap rounded-lg bg-red-500 px-5 py-2 font-medium text-white transition hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="whitespace-nowrap rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="whitespace-nowrap rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition hover:bg-blue-700"
              >
                Register
              </button>
            </>
          )}

        </div>

        {/* =========================
            TABLET AUTH
        ========================= */}
        <div className="hidden items-center gap-2 md:flex xl:hidden">

          {isAuthenticated ? (
            <>
              <button
                onClick={() => navigate("/ai-wellness")}
                className="rounded-lg border border-blue-200 px-3 py-2 font-medium text-blue-600 transition hover:bg-blue-50"
              >
                🤖 AI
              </button>

              <button
                onClick={() => navigate("/settings")}
                className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
              >
                Settings
              </button>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-red-500 px-4 py-2 font-medium text-white hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 hover:bg-slate-100"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
              >
                Register
              </button>
            </>
          )}

        </div>

        {/* =========================
            MOBILE MENU BUTTON
        ========================= */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-3xl text-slate-700 md:hidden"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* =========================
          MOBILE MENU
      ========================= */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">

          <nav className="flex flex-col gap-1">

            <Link
              to="/"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 font-medium text-slate-700 hover:bg-slate-100"
            >
              🏠 Home
            </Link>

            <Link
              to="/doctors"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 font-medium text-slate-700 hover:bg-slate-100"
            >
              👨‍⚕️ Doctors
            </Link>

            <Link
              to="/appointments"
              onClick={closeMobileMenu}
              className="rounded-lg px-4 py-3 font-medium text-slate-700 hover:bg-slate-100"
            >
              📅 Appointments
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/profile"
                  onClick={closeMobileMenu}
                  className="rounded-lg px-4 py-3 font-medium text-slate-700 hover:bg-slate-100"
                >
                  👤 Profile
                </Link>

                {/* AI SHORTCUT */}
                <Link
                  to="/ai-wellness"
                  onClick={closeMobileMenu}
                  className="rounded-lg bg-blue-50 px-4 py-3 font-semibold text-blue-600 hover:bg-blue-100"
                >
                  🤖 CareConnect AI
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <>
                <div className="my-2 border-t border-slate-200" />

                <div className="px-4 py-2 text-sm text-slate-500">
                  Hi, {user?.name}
                </div>

                <button
                  onClick={() => {
                    closeMobileMenu();
                    navigate("/settings");
                  }}
                  className="rounded-lg px-4 py-3 text-left font-medium text-slate-700 hover:bg-slate-100"
                >
                  ⚙️ Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="mt-1 rounded-lg bg-red-500 px-4 py-3 text-left font-medium text-white hover:bg-red-600"
                >
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <div className="my-2 border-t border-slate-200" />

                <button
                  onClick={() => {
                    closeMobileMenu();
                    navigate("/login");
                  }}
                  className="rounded-lg border border-slate-300 px-4 py-3 font-medium text-slate-700 hover:bg-slate-100"
                >
                  Login
                </button>

                <button
                  onClick={() => {
                    closeMobileMenu();
                    navigate("/register");
                  }}
                  className="mt-2 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Register
                </button>
              </>
            )}

          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;