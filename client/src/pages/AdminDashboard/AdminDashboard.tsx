import { useEffect, useState } from "react";

interface AdminStats {
  patients: number;
  doctors: number;
  appointments: number;
  categories: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats>({
    patients: 0,
    doctors: 0,
    appointments: 0,
    categories: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(
          "http://localhost:5000/api/admin/stats",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load statistics"
          );
        }

        setStats(data.stats);
      } catch (error) {
        console.error("Admin stats error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-[calc(100vh-76px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            CareConnect Administration
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Manage doctors, patients, appointments, and the
            CareConnect platform.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* Patients */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              👥
            </div>

            <p className="text-sm font-medium text-slate-500">
              Patients
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {loading ? "..." : stats.patients}
            </p>
          </div>

          {/* Doctors */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-2xl">
              👨‍⚕️
            </div>

            <p className="text-sm font-medium text-slate-500">
              Doctors
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {loading ? "..." : stats.doctors}
            </p>
          </div>

          {/* Appointments */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-2xl">
              📅
            </div>

            <p className="text-sm font-medium text-slate-500">
              Appointments
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {loading ? "..." : stats.appointments}
            </p>
          </div>

          {/* Categories */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              🏷️
            </div>

            <p className="text-sm font-medium text-slate-500">
              Categories
            </p>

            <p className="mt-1 text-3xl font-bold text-slate-900">
              {loading ? "..." : stats.categories}
            </p>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-xl font-bold text-slate-900">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage the main areas of CareConnect.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <button
              type="button"
              className="rounded-xl border border-slate-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="text-2xl">
                👨‍⚕️
              </div>

              <h3 className="mt-3 font-semibold text-slate-900">
                Manage Doctors
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add, edit, and manage doctors.
              </p>
            </button>

            <button
              type="button"
              className="rounded-xl border border-slate-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="text-2xl">
                📅
              </div>

              <h3 className="mt-3 font-semibold text-slate-900">
                Manage Appointments
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                View and manage appointments.
              </p>
            </button>

            <button
              type="button"
              className="rounded-xl border border-slate-200 p-5 text-left transition hover:border-blue-300 hover:bg-blue-50"
            >
              <div className="text-2xl">
                👥
              </div>

              <h3 className="mt-3 font-semibold text-slate-900">
                Manage Users
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                View registered patients and users.
              </p>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;