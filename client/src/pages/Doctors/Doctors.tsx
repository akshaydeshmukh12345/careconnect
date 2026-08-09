import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  experience: number;
  qualification: string;
  email: string;
  phone?: string;
  consultationFee: number;
  available: boolean;
}

const Doctors = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDoctor, setSelectedDoctor] =
    useState<Doctor | null>(null);

  const [appointmentDate, setAppointmentDate] = useState("");
  const [reason, setReason] = useState("");
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/doctors"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await response.json();

        setDoctors(data.doctors || []);
      } catch (error) {
        console.error("Doctors fetch error:", error);
        setError("Unable to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = async () => {
    setBookingError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!selectedDoctor) {
      return;
    }

    if (!appointmentDate) {
      setBookingError("Please select an appointment date and time.");
      return;
    }

    try {
      setBooking(true);

      const response = await fetch(
        "http://localhost:5000/api/appointments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctor: selectedDoctor._id,
            appointmentDate,
            reason,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to book appointment"
        );
      }

      alert("Appointment booked successfully!");

      setSelectedDoctor(null);
      setAppointmentDate("");
      setReason("");

      navigate("/appointments");
    } catch (error) {
      console.error("Booking error:", error);

      setBookingError(
        error instanceof Error
          ? error.message
          : "Failed to book appointment"
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-slate-900">
            Find a Doctor
          </h1>

          <p className="mt-4 text-slate-500">
            Loading doctors...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-bold text-slate-900">
            Find a Doctor
          </h1>

          <p className="mt-4 text-red-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">
            Find a Doctor
          </h1>

          <p className="mt-2 text-slate-500">
            Find the right doctor for your healthcare needs.
          </p>
        </div>

        {/* Doctor Cards */}
        {doctors.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-800">
              No doctors available
            </h2>

            <p className="mt-2 text-slate-500">
              Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Doctor */}
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                    {doctor.name.charAt(0)}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {doctor.name}
                    </h2>

                    <p className="text-blue-600">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  <p>
                    <span className="font-semibold text-slate-900">
                      Qualification:
                    </span>{" "}
                    {doctor.qualification}
                  </p>

                  <p>
                    <span className="font-semibold text-slate-900">
                      Experience:
                    </span>{" "}
                    {doctor.experience} years
                  </p>

                  <p>
                    <span className="font-semibold text-slate-900">
                      Consultation:
                    </span>{" "}
                    ₹{doctor.consultationFee}
                  </p>

                  <p>
                    <span className="font-semibold text-slate-900">
                      Status:
                    </span>{" "}
                    <span
                      className={
                        doctor.available
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {doctor.available
                        ? "Available"
                        : "Not Available"}
                    </span>
                  </p>
                </div>

                {/* Book */}
                <button
                  onClick={() => {
                    if (!localStorage.getItem("token")) {
                      navigate("/login");
                      return;
                    }

                    setSelectedDoctor(doctor);
                  }}
                  disabled={!doctor.available}
                  className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  Book Appointment
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Book Appointment
                </h2>

                <p className="mt-1 text-slate-500">
                  {selectedDoctor.name}
                </p>
              </div>

              <button
                onClick={() => setSelectedDoctor(null)}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            {/* Date */}
            <label className="mb-2 block font-medium text-slate-700">
              Appointment Date & Time
            </label>

            <input
              type="datetime-local"
              value={appointmentDate}
              onChange={(e) =>
                setAppointmentDate(e.target.value)
              }
              className="mb-5 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            />

            {/* Reason */}
            <label className="mb-2 block font-medium text-slate-700">
              Reason for Visit
            </label>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Describe your problem..."
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-600"
            />

            {/* Error */}
            {bookingError && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {bookingError}
              </p>
            )}

            {/* Actions */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setSelectedDoctor(null)}
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 font-medium hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleBookAppointment}
                disabled={booking}
                className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-medium text-white hover:bg-blue-700 disabled:bg-blue-300"
              >
                {booking ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;