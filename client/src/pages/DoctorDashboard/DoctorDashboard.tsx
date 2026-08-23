import { useEffect, useState } from "react";

interface Patient {
  _id: string;
  name: string;
  email: string;
  phone?: string;
}

interface Appointment {
  _id: string;
  appointmentDate: string;
  reason?: string;
  status: string;
  patient: Patient;
}

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: number;
  qualification: string;
  email: string;
  phone?: string;
  consultationFee: number;
  available: boolean;
}

interface Statistics {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

const DoctorDashboard = () => {
  const [doctor, setDoctor] =
    useState<Doctor | null>(null);

  const [statistics, setStatistics] =
    useState<Statistics>({
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    });

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // =========================================
  // GET TOKEN
  // =========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================================
  // FETCH DOCTOR DASHBOARD
  // =========================================

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Please login as a doctor."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/doctors/dashboard`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        );

      if (
        !contentType?.includes(
          "application/json"
        )
      ) {
        throw new Error(
          "Server returned an invalid response. Please check the backend API."
        );
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load doctor dashboard"
        );
      }

      setDoctor(data.doctor);

      setStatistics(
        data.statistics || {
          total: 0,
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
        }
      );

      setAppointments(
        data.appointments || []
      );
    } catch (error) {
      console.error(
        "Doctor dashboard error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load doctor dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOAD DASHBOARD
  // =========================================

  useEffect(() => {
    fetchDashboard();
  }, []);

  // =========================================
  // UPDATE APPOINTMENT STATUS
  // =========================================

  const updateAppointmentStatus = async (
    appointmentId: string,
    status:
      | "confirmed"
      | "cancelled"
      | "completed"
  ) => {
    try {
      setUpdatingId(appointmentId);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Please login again."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/appointments/${appointmentId}/status`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status,
          }),
        }
      );

      const contentType =
        response.headers.get(
          "content-type"
        );

      if (
        !contentType?.includes(
          "application/json"
        )
      ) {
        throw new Error(
          "Server returned an invalid response."
        );
      }

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update appointment"
        );
      }

      setSuccess(
        data.message ||
          `Appointment ${status} successfully`
      );

      // Refresh dashboard
      await fetchDashboard();
    } catch (error) {
      console.error(
        "Update appointment error:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update appointment"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================
  // CONFIRM APPOINTMENT
  // =========================================

  const handleConfirm = (
    appointmentId: string
  ) => {
    updateAppointmentStatus(
      appointmentId,
      "confirmed"
    );
  };

  // =========================================
  // CANCEL APPOINTMENT
  // =========================================

  const handleCancel = (
    appointmentId: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to cancel this appointment?"
      );

    if (!confirmed) {
      return;
    }

    updateAppointmentStatus(
      appointmentId,
      "cancelled"
    );
  };

  // =========================================
  // COMPLETE APPOINTMENT
  // =========================================

  const handleComplete = (
    appointmentId: string
  ) => {
    const confirmed =
      window.confirm(
        "Mark this appointment as completed?"
      );

    if (!confirmed) {
      return;
    }

    updateAppointmentStatus(
      appointmentId,
      "completed"
    );
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <p className="text-lg text-slate-600">
          Loading doctor dashboard...
        </p>
      </div>
    );
  }

  // =========================================
  // ERROR
  // =========================================

  if (error && !doctor) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-xl bg-red-50 p-5 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  // =========================================
  // DASHBOARD
  // =========================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* =====================================
            HEADER
        ===================================== */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Doctor Portal
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your patients and
            appointments.
          </p>
        </div>

        {/* =====================================
            ERROR MESSAGE
        ===================================== */}

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-600">
            {error}
          </div>
        )}

        {/* =====================================
            SUCCESS MESSAGE
        ===================================== */}

        {success && (
          <div className="mb-6 rounded-xl bg-green-50 p-4 text-green-600">
            {success}
          </div>
        )}

        {/* =====================================
            DOCTOR PROFILE
        ===================================== */}

        {doctor && (
          <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-5">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
                {doctor.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Welcome, {doctor.name}
                </h2>

                <p className="mt-1 text-blue-600">
                  {doctor.specialization}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {doctor.qualification} •{" "}
                  {doctor.experience} years
                  experience
                </p>
              </div>

            </div>
          </div>
        )}

        {/* =====================================
            STATISTICS
        ===================================== */}

        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

          {/* Total */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Total Appointments
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {statistics.total}
            </p>
          </div>

          {/* Pending */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {statistics.pending}
            </p>
          </div>

          {/* Confirmed */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Confirmed
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {statistics.confirmed}
            </p>
          </div>

          {/* Completed */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {statistics.completed}
            </p>
          </div>

          {/* Cancelled */}

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Cancelled
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {statistics.cancelled}
            </p>
          </div>

        </div>

        {/* =====================================
            PATIENT APPOINTMENTS
        ===================================== */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 p-6">

            <h2 className="text-xl font-bold text-slate-900">
              Patient Appointments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Appointments booked with you.
            </p>

          </div>

          {/* No appointments */}

          {appointments.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-slate-500">
                No appointments found.
              </p>
            </div>
          ) : (

            <div className="divide-y divide-slate-200">

              {appointments.map(
                (appointment) => {

                  const isUpdating =
                    updatingId ===
                    appointment._id;

                  return (
                    <div
                      key={appointment._id}
                      className="p-6"
                    >

                      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

                        {/* =================================
                            PATIENT INFORMATION
                        ================================= */}

                        <div className="flex-1">

                          <h3 className="text-lg font-semibold text-slate-900">
                            {appointment.patient
                              ?.name ||
                              "Unknown Patient"}
                          </h3>

                          <p className="mt-1 text-sm text-slate-500">
                            {appointment.patient
                              ?.email}
                          </p>

                          {appointment.patient
                            ?.phone && (
                            <p className="text-sm text-slate-500">
                              {
                                appointment
                                  .patient
                                  .phone
                              }
                            </p>
                          )}

                          <p className="mt-3 text-sm text-slate-700">
                            <strong>
                              Appointment:
                            </strong>{" "}
                            {new Date(
                              appointment.appointmentDate
                            ).toLocaleString()}
                          </p>

                          {appointment.reason && (
                            <p className="mt-1 text-sm text-slate-600">
                              <strong>
                                Reason:
                              </strong>{" "}
                              {
                                appointment.reason
                              }
                            </p>
                          )}

                        </div>

                        {/* =================================
                            STATUS + ACTIONS
                        ================================= */}

                        <div className="flex flex-col items-start gap-4 lg:items-end">

                          {/* STATUS */}

                          <span
                            className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                              appointment.status ===
                              "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : appointment.status ===
                                  "confirmed"
                                ? "bg-blue-100 text-blue-700"
                                : appointment.status ===
                                  "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {appointment.status}
                          </span>

                          {/* =================================
                              PENDING ACTIONS
                          ================================= */}

                          {appointment.status ===
                            "pending" && (
                            <div className="flex flex-wrap gap-3">

                              <button
                                onClick={() =>
                                  handleConfirm(
                                    appointment._id
                                  )
                                }
                                disabled={
                                  isUpdating
                                }
                                className="rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isUpdating
                                  ? "Updating..."
                                  : "Confirm"}
                              </button>

                              <button
                                onClick={() =>
                                  handleCancel(
                                    appointment._id
                                  )
                                }
                                disabled={
                                  isUpdating
                                }
                                className="rounded-xl bg-red-500 px-5 py-2.5 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Cancel
                              </button>

                            </div>
                          )}

                          {/* =================================
                              CONFIRMED ACTIONS
                          ================================= */}

                          {appointment.status ===
                            "confirmed" && (
                            <div className="flex flex-wrap gap-3">

                              <button
                                onClick={() =>
                                  handleComplete(
                                    appointment._id
                                  )
                                }
                                disabled={
                                  isUpdating
                                }
                                className="rounded-xl bg-green-600 px-5 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isUpdating
                                  ? "Updating..."
                                  : "Complete"}
                              </button>

                              <button
                                onClick={() =>
                                  handleCancel(
                                    appointment._id
                                  )
                                }
                                disabled={
                                  isUpdating
                                }
                                className="rounded-xl bg-red-500 px-5 py-2.5 font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                Cancel
                              </button>

                            </div>
                          )}

                          {/* =================================
                              COMPLETED
                          ================================= */}

                          {appointment.status ===
                            "completed" && (
                            <p className="text-sm font-semibold text-green-600">
                              Appointment completed
                            </p>
                          )}

                          {/* =================================
                              CANCELLED
                          ================================= */}

                          {appointment.status ===
                            "cancelled" && (
                            <p className="text-sm font-semibold text-red-600">
                              Appointment cancelled
                            </p>
                          )}

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;