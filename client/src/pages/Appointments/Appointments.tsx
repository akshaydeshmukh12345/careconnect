import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

type Doctor = {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  qualification: string;
  consultationFee: number;
  available: boolean;
};

type Appointment = {
  _id: string;
  appointmentDate: string;
  reason?: string;
  status: string;
  doctor?: {
    _id: string;
    name: string;
    specialization: string;
    experience: number;
    qualification: string;
    consultationFee: number;
  };
};

/*
 * API URL
 *
 * Your .env should be:
 *
 * VITE_API_URL=http://localhost:5000/api
 *
 * This also protects against accidentally adding /api twice.
 */
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const Appointments = () => {
  const [searchParams] = useSearchParams();

  // Doctor ID coming from:
  // /appointments?doctor=DOCTOR_ID
  const doctorId = searchParams.get("doctor");

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [appointmentDate, setAppointmentDate] = useState("");
  const [reason, setReason] = useState("");

  const [loadingDoctor, setLoadingDoctor] = useState(false);
  const [loadingAppointments, setLoadingAppointments] = useState(false);
  const [booking, setBooking] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================
  // GET TOKEN
  // =========================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================================
  // LOAD SELECTED DOCTOR
  // =========================================

  useEffect(() => {
    if (!doctorId) {
      setDoctor(null);
      return;
    }

    const loadDoctor = async () => {
      try {
        setLoadingDoctor(true);
        setError("");

        const response = await fetch(`${API_BASE_URL}/doctors`);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load doctors"
          );
        }

        const foundDoctor = data.doctors?.find(
          (item: Doctor) => item._id === doctorId
        );

        if (!foundDoctor) {
          setError("Doctor not found.");
          return;
        }

        setDoctor(foundDoctor);
      } catch (err) {
        console.error("Load doctor error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load doctor"
        );
      } finally {
        setLoadingDoctor(false);
      }
    };

    loadDoctor();
  }, [doctorId]);

  // =========================================
  // LOAD MY APPOINTMENTS
  // =========================================

  const loadAppointments = async () => {
    try {
      setLoadingAppointments(true);

      const token = getToken();

      if (!token) {
        setError("Please login to view appointments.");
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/appointments/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load appointments"
        );
      }

      setAppointments(data.appointments || []);
    } catch (err) {
      console.error("Load appointments error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load appointments"
      );
    } finally {
      setLoadingAppointments(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // =========================================
  // BOOK APPOINTMENT
  // =========================================

  const handleBookAppointment = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!doctorId) {
      setError("Please select a doctor first.");
      return;
    }

    if (!appointmentDate) {
      setError("Please select appointment date and time.");
      return;
    }

    const token = getToken();

    if (!token) {
      setError("Please login before booking an appointment.");
      return;
    }

    try {
      setBooking(true);

      const response = await fetch(
        `${API_BASE_URL}/appointments`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            doctor: doctorId,
            appointmentDate,
            reason,
          }),
        }
      );

      /*
       * Read response safely.
       * If backend returns HTML instead of JSON,
       * show a useful error instead of:
       * Unexpected token '<'
       */
      const contentType =
        response.headers.get("content-type") || "";

      let data: any;

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();

        throw new Error(
          `Server returned ${response.status}. Please check API URL: ${API_BASE_URL}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to book appointment"
        );
      }

      setSuccess("Appointment booked successfully!");

      setAppointmentDate("");
      setReason("");

      // Refresh appointments
      await loadAppointments();
    } catch (err) {
      console.error("Book appointment error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to book appointment"
      );
    } finally {
      setBooking(false);
    }
  };

  // =========================================
  // CANCEL APPOINTMENT
  // =========================================

  const handleCancel = async (id: string) => {
    const token = getToken();

    if (!token) {
      setError("Please login again.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this appointment?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE_URL}/appointments/${id}/cancel`,
        {
          method: "PATCH",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to cancel appointment"
        );
      }

      setSuccess("Appointment cancelled successfully.");

      await loadAppointments();
    } catch (err) {
      console.error("Cancel appointment error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to cancel appointment"
      );
    }
  };

  // =========================================
  // RESCHEDULE APPOINTMENT
  // =========================================

  const handleReschedule = async (id: string) => {
    const newDate = window.prompt(
      "Enter new appointment date and time.\nExample: 2026-08-25T15:30"
    );

    if (!newDate) return;

    const token = getToken();

    if (!token) {
      setError("Please login again.");
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `${API_BASE_URL}/appointments/${id}/reschedule`,
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

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to reschedule appointment"
        );
      }

      setSuccess(
        "Appointment rescheduled successfully."
      );

      await loadAppointments();
    } catch (err) {
      console.error("Reschedule appointment error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to reschedule appointment"
      );
    }
  };

  // =========================================
  // FORMAT DATE
  // =========================================

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString();
  };

  // =========================================
  // UI
  // =========================================

  return (
    <section className="min-h-screen bg-slate-50 py-12">
      <div className="mx-auto max-w-6xl px-6">

        {/* PAGE HEADER */}

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-slate-900">
            My Appointments
          </h1>

          <p className="mt-2 text-lg text-slate-500">
            Manage your upcoming and previous appointments.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 px-5 py-4 text-red-600">
            {error}
          </div>
        )}

        {/* SUCCESS */}

        {success && (
          <div className="mb-6 rounded-xl bg-green-50 px-5 py-4 text-green-600">
            {success}
          </div>
        )}

        {/* =====================================
            BOOKING SECTION
        ===================================== */}

        {doctorId && (
          <div className="mb-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

            <h2 className="text-2xl font-bold text-slate-900">
              Book an Appointment
            </h2>

            <p className="mt-2 text-slate-500">
              Select your preferred date and time.
            </p>

            {loadingDoctor ? (
              <div className="mt-8 text-slate-500">
                Loading doctor details...
              </div>
            ) : doctor ? (
              <div className="mt-8">

                {/* DOCTOR INFORMATION */}

                <div className="mb-8 rounded-2xl bg-blue-50 p-6">

                  <div className="flex items-center gap-5">

                    {/* NO PHOTO */}
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                      {doctor.name.charAt(0)}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {doctor.name}
                      </h3>

                      <p className="mt-1 text-blue-600">
                        {doctor.specialization}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        {doctor.qualification}
                      </p>
                    </div>

                  </div>

                  <div className="mt-5 flex flex-wrap gap-6 text-sm text-slate-600">

                    <span>
                      Experience:{" "}
                      <strong>
                        {doctor.experience} Years
                      </strong>
                    </span>

                    <span>
                      Consultation Fee:{" "}
                      <strong>
                        ₹{doctor.consultationFee}
                      </strong>
                    </span>

                    <span
                      className={
                        doctor.available
                          ? "font-semibold text-green-600"
                          : "font-semibold text-red-600"
                      }
                    >
                      ●{" "}
                      {doctor.available
                        ? "Available"
                        : "Not Available"}
                    </span>

                  </div>
                </div>

                {/* BOOKING FORM */}

                <form
                  onSubmit={handleBookAppointment}
                  className="space-y-6"
                >

                  <div>
                    <label className="mb-2 block font-semibold text-slate-700">
                      Appointment Date & Time
                    </label>

                    <input
                      type="datetime-local"
                      value={appointmentDate}
                      onChange={(event) =>
                        setAppointmentDate(
                          event.target.value
                        )
                      }
                      min={new Date()
                        .toISOString()
                        .slice(0, 16)}
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold text-slate-700">
                      Reason for Visit
                    </label>

                    <textarea
                      value={reason}
                      onChange={(event) =>
                        setReason(event.target.value)
                      }
                      placeholder="Tell the doctor about your problem..."
                      rows={4}
                      className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      booking || !doctor.available
                    }
                    className="w-full rounded-xl bg-blue-600 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                  >
                    {booking
                      ? "Booking..."
                      : "Confirm Appointment"}
                  </button>

                </form>
              </div>
            ) : (
              !loadingDoctor && (
                <div className="mt-8 text-red-600">
                  Doctor not found.
                </div>
              )
            )}
          </div>
        )}

        {/* =====================================
            EXISTING APPOINTMENTS
        ===================================== */}

        <div>

          <h2 className="mb-6 text-2xl font-bold text-slate-900">
            Your Appointments
          </h2>

          {loadingAppointments ? (
            <div className="rounded-2xl bg-white p-8 text-center text-slate-500">
              Loading appointments...
            </div>
          ) : appointments.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-sm">
              <p className="text-lg text-slate-500">
                You don't have any appointments yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">

              {appointments.map((appointment) => (

                <div
                  key={appointment._id}
                  className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm"
                >

                  {/* DOCTOR */}

                  <div className="flex items-center gap-4">

                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-xl font-bold text-white">
                      {appointment.doctor?.name?.charAt(0) ||
                        "D"}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {appointment.doctor?.name ||
                          "Doctor"}
                      </h3>

                      <p className="text-blue-600">
                        {appointment.doctor
                          ?.specialization ||
                          "Specialist"}
                      </p>
                    </div>

                  </div>

                  {/* APPOINTMENT DETAILS */}

                  <div className="mt-7 grid gap-5 md:grid-cols-2">

                    <div>
                      <p className="text-sm text-slate-500">
                        Appointment Date
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {formatDate(
                          appointment.appointmentDate
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">
                        Consultation Fee
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        ₹
                        {appointment.doctor
                          ?.consultationFee || 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">
                        Reason for Visit
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {appointment.reason ||
                          "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">
                        Status
                      </p>

                      <span
                        className={`mt-2 inline-block rounded-full px-4 py-1 text-sm font-semibold ${
                          appointment.status ===
                          "cancelled"
                            ? "bg-red-100 text-red-600"
                            : appointment.status ===
                              "completed"
                            ? "bg-green-100 text-green-600"
                            : appointment.status ===
                              "confirmed"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {appointment.status
                          .charAt(0)
                          .toUpperCase() +
                          appointment.status.slice(1)}
                      </span>
                    </div>

                  </div>

                  {/* BUTTONS */}

                  {appointment.status === "pending" && (
                    <div className="mt-7 flex flex-wrap gap-4">

                      <button
                        onClick={() =>
                          handleReschedule(
                            appointment._id
                          )
                        }
                        className="rounded-xl border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
                      >
                        Reschedule
                      </button>

                      <button
                        onClick={() =>
                          handleCancel(
                            appointment._id
                          )
                        }
                        className="rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition hover:bg-red-600"
                      >
                        Cancel Appointment
                      </button>

                    </div>
                  )}

                  {appointment.status === "cancelled" && (
                    <div className="mt-6 rounded-xl bg-red-50 p-4 text-center font-semibold text-red-600">
                      This appointment has been
                      cancelled.
                    </div>
                  )}

                  {appointment.status === "completed" && (
                    <div className="mt-6 rounded-xl bg-green-50 p-4 text-center font-semibold text-green-600">
                      This appointment has been
                      completed.
                    </div>
                  )}

                </div>
              ))}

            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default Appointments;