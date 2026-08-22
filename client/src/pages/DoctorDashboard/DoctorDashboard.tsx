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

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Please login as a doctor."
          );
        }

        const response = await fetch(
          "https://careconnect-1-chxq.onrender.com/api/doctors/dashboard",
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

        // Prevent JSON parse error when server
        // accidentally returns HTML
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
          data.statistics
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

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-lg text-slate-600">
          Loading doctor dashboard...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="rounded-xl bg-red-50 p-5 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Doctor Portal
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your patients and
            appointments.
          </p>
        </div>


        {/* Doctor Profile */}
        {doctor && (
          <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">

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


        {/* Statistics */}
        <div className="mb-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">
              Total Appointments
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {statistics.total}
            </p>
          </div>


          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {statistics.pending}
            </p>
          </div>


          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">
              Confirmed
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {statistics.confirmed}
            </p>
          </div>


          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">
              Completed
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {statistics.completed}
            </p>
          </div>


          <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
            <p className="text-sm text-slate-500">
              Cancelled
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              {statistics.cancelled}
            </p>
          </div>

        </div>


        {/* Appointments */}
        <div className="rounded-2xl bg-white shadow-sm border border-slate-200">

          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-bold text-slate-900">
              Patient Appointments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Appointments booked with you.
            </p>
          </div>


          {appointments.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-slate-500">
                No appointments found.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">

              {appointments.map(
                (appointment) => (
                  <div
                    key={appointment._id}
                    className="p-6"
                  >

                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                      <div>

                        <h3 className="text-lg font-semibold text-slate-900">
                          {appointment.patient?.name ||
                            "Unknown Patient"}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {appointment.patient?.email}
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


                      <div>

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
                          {
                            appointment.status
                          }
                        </span>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default DoctorDashboard;
