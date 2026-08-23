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

const FeaturedDoctors = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/doctors"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch doctors"
          );
        }

        // Supports both:
        // [doctor, doctor, ...]
        // { doctors: [...] }
        const doctorList = Array.isArray(data)
          ? data
          : data.doctors || [];

        setDoctors(doctorList.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
        setError("Unable to load doctors.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleBookAppointment = (doctorId: string) => {
    navigate(`/appointments?doctor=${doctorId}`);
  };

  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Featured Doctors
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            Meet Our Specialists
          </h2>

          <p className="mt-4 text-slate-500">
            Experienced doctors ready to help you.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-16 text-center text-slate-500">
            Loading doctors...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-16 rounded-xl bg-red-50 p-5 text-center text-red-600">
            {error}
          </div>
        )}

        {/* No Doctors */}
        {!loading && !error && doctors.length === 0 && (
          <div className="mt-16 text-center text-slate-500">
            No doctors available yet.
          </div>
        )}

        {/* Doctors */}
        {!loading && !error && doctors.length > 0 && (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {doctors.map((doctor) => (
              <div
                key={doctor._id}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                {/* Doctor Avatar */}
                <div className="flex justify-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-full bg-blue-100 text-6xl">
                    👨‍⚕️
                  </div>
                </div>

                {/* Name */}
                <h3 className="mt-6 text-center text-2xl font-bold text-slate-900">
                  {doctor.name}
                </h3>

                {/* Specialization */}
                <p className="mt-2 text-center text-blue-600">
                  {doctor.specialization}
                </p>

                {/* Details */}
                <div className="mt-6 flex justify-between text-sm text-slate-500">
                  <span>
                    {doctor.experience} Years
                  </span>

                  <span>
                    ₹{doctor.consultationFee}
                  </span>
                </div>

                {/* Qualification */}
                <p className="mt-3 text-center text-sm text-slate-500">
                  {doctor.qualification}
                </p>

                {/* Availability */}
                <div className="mt-4 text-center">
                  {doctor.available ? (
                    <span className="text-sm font-semibold text-green-600">
                      ● Available
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-red-500">
                      ● Currently unavailable
                    </span>
                  )}
                </div>

                {/* Book Appointment */}
                <button
                  onClick={() =>
                    handleBookAppointment(doctor._id)
                  }
                  disabled={!doctor.available}
                  className={`mt-8 w-full rounded-xl py-3 font-semibold text-white transition ${
                    doctor.available
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "cursor-not-allowed bg-slate-400"
                  }`}
                >
                  {doctor.available
                    ? "Book Appointment"
                    : "Not Available"}
                </button>

              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedDoctors;