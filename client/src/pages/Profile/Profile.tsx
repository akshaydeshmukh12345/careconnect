import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { updateUser, logout } = useAuth();

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // =========================
  // FETCH PROFILE
  // =========================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

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

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load profile"
          );
        }

        setUser(data.user);
        setName(data.user.name || "");
        setPhone(data.user.phone || "");
      } catch (error) {
        console.error("Profile error:", error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // =========================
  // START EDIT
  // =========================
  const handleEdit = () => {
    if (!user) {
      return;
    }

    setName(user.name || "");
    setPhone(user.phone || "");

    setError("");
    setSuccess("");
    setEditing(true);
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const handleCancelEdit = () => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
    }

    setError("");
    setSuccess("");
    setEditing(false);
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      setSaving(true);
      setError("");
      setSuccess("");

      console.log("Updating profile...");
      console.log("Token exists:", !!token);
      console.log("Name:", name);
      console.log("Phone:", phone);

      const response = await fetch(
        "http://localhost:5000/api/users/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
          }),
        }
      );

      console.log("PATCH status:", response.status);

      const data = await response.json();

      console.log("PATCH response:", data);

      if (!response.ok || !data.success) {
        setError(
          data.message || "Failed to update profile"
        );
        return;
      }

      // Update profile page
      setUser(data.user);

      // Update AuthContext + localStorage
      updateUser(data.user);

      // Update form values
      setName(data.user.name || "");
      setPhone(data.user.phone || "");

      setEditing(false);
      setSuccess("Profile updated successfully.");
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError(
          "Unable to connect to the server. Please check that the backend is running."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-10 text-center shadow-sm">
          <p className="text-slate-500">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error && !user) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-4xl rounded-2xl bg-red-50 p-6 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            My Profile
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your CareConnect account information.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 rounded-xl bg-green-50 p-4 font-medium text-green-700">
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && user && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 font-medium text-red-600">
            {error}
          </div>
        )}

        {/* Profile Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          {/* Avatar */}
          <div className="mb-8 flex items-center gap-5">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {user?.name}
              </h2>

              <p className="capitalize text-slate-500">
                {user?.role || "Patient"}
              </p>
            </div>
          </div>

          {/* ========================= */}
          {/* VIEW MODE */}
          {/* ========================= */}
          {!editing ? (
            <>
              <div className="grid gap-5 md:grid-cols-2">

                {/* Name */}
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">
                    Full Name
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {user?.name}
                  </p>
                </div>

                {/* Email */}
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">
                    Email Address
                  </p>

                  <p className="mt-1 break-all font-semibold text-slate-900">
                    {user?.email}
                  </p>
                </div>

                {/* Phone */}
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">
                    Phone Number
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {user?.phone || "Not provided"}
                  </p>
                </div>

                {/* Role */}
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-sm font-medium text-slate-500">
                    Account Role
                  </p>

                  <p className="mt-1 font-semibold capitalize text-slate-900">
                    {user?.role || "Patient"}
                  </p>
                </div>

              </div>

              {/* Buttons */}
              <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">

                <button
                  onClick={handleEdit}
                  className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Edit Profile
                </button>

                <button
                  onClick={() => navigate("/settings")}
                  className="rounded-lg border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Account Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="rounded-lg bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
                >
                  Logout
                </button>

              </div>
            </>
          ) : (
            /* ========================= */
            /* EDIT MODE */
            /* ========================= */
            <div className="space-y-6">

              {/* Name */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500"
                />

                <p className="mt-2 text-sm text-slate-500">
                  Email address cannot be changed here.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block font-medium text-slate-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row">

                <button
                  onClick={handleUpdateProfile}
                  disabled={saving}
                  className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  onClick={handleCancelEdit}
                  disabled={saving}
                  className="rounded-lg border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;