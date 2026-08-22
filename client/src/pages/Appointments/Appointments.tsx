import { useEffect, useState } from "react";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  qualification: string;
  consultationFee: number;
}

interface Appointment {
  _id: string;
  appointmentDate: string;
  reason?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  doctor: Doctor;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login to view your appointments.");
          return;
        }

        const response = await fetch(
          "https://careconnect-1-chxq.onrender.com/api/appointments/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(data.message || "Failed to load appointments");
          return;
        }

        setAppointments(data.appointments || []);
      } catch (error) {
        console.error("Fetch appointments error:", error);
        setError("Failed to connect to server");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancel = async (appointmentId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      setCancellingId(appointmentId);
      setError("");

      const response = await fetch(
        `https://careconnect-1-chxq.onrender.com/api/appointments/${appointmentId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to cancel appointment");
        return;
      }

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment._id === appointmentId
            ? {
                ...appointment,
                status: "cancelled",
              }
            : appointment
        )
      );
    } catch (error) {
      console.error("Cancel appointment error:", error);
      setError("Failed to connect to server");
    } finally {
      setCancellingId(null);
    }
  };

  const openReschedule = (appointment: Appointment) => {
    const currentDate = new Date(appointment.appointmentDate);

    // Convert existing appointment date to datetime-local format
    const formattedDate = new Date(
      currentDate.getTime() - currentDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);

    setNewDate(formattedDate);
    setReschedulingId(appointment._id);
    setError("");
  };

  const handleReschedule = async () => {
    if (!reschedulingId || !newDate) {
      setError("Please select a new date and time.");
      return;
    }

    const selectedDate = new Date(newDate);

    if (selectedDate <= new Date()) {
      setError("Please select a future date and time.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login again.");
        return;
      }

      setError("");

      const response = await fetch(
        `https://careconnect-1-chxq.onrender.com/api/appointments/${reschedulingId}/reschedule`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            appointmentDate: newDate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Failed to reschedule appointment");
        return;
      }

      setAppointments((currentAppointments) =>
        currentAppointments.map((appointment) =>
          appointment._id === reschedulingId
            ? {
                ...appointment,
                appointmentDate: data.appointment.appointmentDate,
              }
            : appointment
        )
      );

      setReschedulingId(null);
      setNewDate("");

      alert("Appointment rescheduled successfully!");
    } catch (error) {
      console.error("Reschedule appointment error:", error);
      setError("Failed to connect to server");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            My Appointments
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your upcoming and previous appointments.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-5 text-red-600">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">
              Loading appointments...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && appointments.length === 0 && (
          <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">
              No appointments yet
            </h2>

            <p className="mt-2 text-slate-500">
              Book an appointment with a doctor to see it here.
            </p>
          </div>
        )}

        {/* Appointments */}
        {!loading && appointments.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">

            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >

                {/* Doctor */}
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                    {appointment.doctor?.name?.charAt(0) || "D"}
                  </div>

                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-semibold text-slate-900">
                      {appointment.doctor?.name}
                    </h2>

                    <p className="text-blue-600">
                      {appointment.doctor?.specialization}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-6 space-y-4">

                  <div>
                    <p className="text-sm text-slate-500">
                      Appointment Date
                    </p>

                    <p className="font-medium text-slate-900">
                      {new Date(
                        appointment.appointmentDate
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Reason for Visit
                    </p>

                    <p className="font-medium text-slate-900">
                      {appointment.reason || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Consultation Fee
                    </p>

                    <p className="font-medium text-slate-900">
                      ₹{appointment.doctor?.consultationFee}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500">
                      Status
                    </p>

                    <span
                      className={`mt-1 inline-block rounded-full px-3 py-1 text-sm font-medium capitalize ${
                        appointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : appointment.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : appointment.status === "confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </div>

                </div>

                {/* Actions */}
                {appointment.status === "pending" && (
                  <div className="mt-6 flex gap-3">

                    <button
                      onClick={() => openReschedule(appointment)}
                      className="flex-1 rounded-lg border border-blue-600 px-4 py-3 font-medium text-blue-600 transition hover:bg-blue-50"
                    >
                      Reschedule
                    </button>

                    <button
                      onClick={() => handleCancel(appointment._id)}
                      disabled={cancellingId === appointment._id}
                      className="flex-1 rounded-lg bg-red-500 px-4 py-3 font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {cancellingId === appointment._id
                        ? "Cancelling..."
                        : "Cancel"}
                    </button>

                  </div>
                )}

                {/* Cancelled */}
                {appointment.status === "cancelled" && (
                  <div className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">
                    This appointment has been cancelled.
                  </div>
                )}

              </div>
            ))}

          </div>
        )}

        {/* Reschedule Modal */}
        {reschedulingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

              <h2 className="text-2xl font-bold text-slate-900">
                Reschedule Appointment
              </h2>

              <p className="mt-2 text-slate-500">
                Select a new date and time for your appointment.
              </p>

              <div className="mt-6">
                <label className="mb-2 block font-medium text-slate-700">
                  New Date & Time
                </label>

                <input
                  type="datetime-local"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
                />
              </div>

              <div className="mt-6 flex gap-3">

                <button
                  onClick={() => {
                    setReschedulingId(null);
                    setNewDate("");
                    setError("");
                  }}
                  className="flex-1 rounded-lg border border-slate-300 px-4 py-3 font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleReschedule}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700"
                >
                  Confirm
                </button>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Appointments;
