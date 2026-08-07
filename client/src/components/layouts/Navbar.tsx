import Logo from "./Logo";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Logo />

        <nav className="hidden gap-8 md:flex">
          <a href="/" className="font-medium text-slate-700 hover:text-blue-600">
            Home
          </a>

          <a
            href="/doctors"
            className="font-medium text-slate-700 hover:text-blue-600"
          >
            Doctors
          </a>

          <a
            href="/appointments"
            className="font-medium text-slate-700 hover:text-blue-600"
          >
            Appointments
          </a>

          <a
            href="/profile"
            className="font-medium text-slate-700 hover:text-blue-600"
          >
            Profile
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <button className="rounded-lg border border-slate-300 px-4 py-2 font-medium hover:bg-slate-100">
            Login
          </button>

          <button className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700">
            Register
          </button>
        </div>

        <button className="text-3xl md:hidden">
          ☰
        </button>
      </div>
    </header>
  );
};

export default Navbar;