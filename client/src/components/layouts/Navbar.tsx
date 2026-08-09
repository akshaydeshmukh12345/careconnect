import { Link } from "react-router-dom";
import Logo from "./Logo";

const Navbar = () => {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link to="/">
          <Logo />
        </Link>

        {/* Navigation */}
        <nav className="hidden gap-8 md:flex">
          <Link
            to="/"
            className="font-medium text-slate-700 hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/doctors"
            className="font-medium text-slate-700 hover:text-blue-600"
          >
            Doctors
          </Link>

          <Link
            to="/appointments"
            className="font-medium text-slate-700 hover:text-blue-600"
          >
            Appointments
          </Link>

          <Link
            to="/profile"
            className="font-medium text-slate-700 hover:text-blue-600"
          >
            Profile
          </Link>
        </nav>

        {/* Auth buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-100"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            Register
          </Link>
        </div>

        {/* Mobile menu */}
        <button className="text-3xl md:hidden">
          ☰
        </button>
      </div>
    </header>
  );
};

export default Navbar;