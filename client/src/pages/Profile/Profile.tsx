import { useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("careconnect_token");

        if (!token) {
          setError("Please login to view your profile.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "http://localhost:5000/api/users/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setUser(data.user);
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("careconnect_token");
    localStorage.removeItem("careconnect_user");

    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">
        <p className="text-slate-500">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4">
        <div className="rounded-xl bg-red-50 px-6 py-5 text-center text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-3xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your CareConnect account information.
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          {/* Avatar */}
          <div className="mb-8 flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {user?.name}
              </h2>

              <p className="text-slate-500">
                {user?.role || "Patient"}
              </p>
            </div>
          </div>

          {/* Information */}
          <div className="grid gap-5 md:grid-cols-2">

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Full Name
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {user?.name}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Email Address
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {user?.email}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Phone Number
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                {user?.phone || "Not provided"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Account Role
              </p>

              <p className="mt-1 font-semibold capitalize text-slate-900">
                {user?.role || "Patient"}
              </p>
            </div>

          </div>

          {/* Logout */}
          <div className="mt-8 border-t border-slate-200 pt-6">
            <button
              onClick={handleLogout}
              className="rounded-lg bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
            >
              Logout
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;