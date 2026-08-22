import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Settings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Settings
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your CareConnect account.
          </p>
        </div>

        {/* Account */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Account
          </h2>

          <div className="mt-5 space-y-4">
            <div>
              <p className="text-sm text-slate-500">
                Name
              </p>

              <p className="font-medium text-slate-900">
                {user?.name || "User"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Email
              </p>

              <p className="font-medium text-slate-900">
                {user?.email || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Role
              </p>

              <p className="font-medium capitalize text-slate-900">
                {user?.role || "Patient"}
              </p>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Security
          </h2>

          <button
            onClick={() => alert("Change password feature coming soon.")}
            className="mt-5 rounded-lg border border-slate-300 px-5 py-3 font-medium text-slate-700 hover:bg-slate-50"
          >
            Change Password
          </button>
        </div>

        {/* Logout */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">
            Session
          </h2>

          <p className="mt-2 text-slate-500">
            Sign out of your CareConnect account.
          </p>

          <button
            onClick={handleLogout}
            className="mt-5 rounded-lg bg-red-500 px-5 py-3 font-medium text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-6 font-medium text-blue-600 hover:underline"
        >
          ← Back
        </button>

      </div>
    </div>
  );
};

export default Settings;
