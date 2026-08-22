import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Doctor {
  _id: string;
  name: string;
  category?: string;
  specialization: string;
  experience?: number;
  qualification: string;
  languages?: string;
  email?: string;
  phone?: string;
  consultationFee?: number;
  available: boolean;
  profileImage?: string;
}

const Doctors = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [selectedDoctor, setSelectedDoctor] =
    useState<Doctor | null>(null);

  const [appointmentDate, setAppointmentDate] =
    useState("");

  const [reason, setReason] = useState("");
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // ==========================================
  // FETCH DOCTORS
  // ==========================================

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/doctors"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await response.json();

        setDoctors(data.doctors || []);
      } catch (err) {
        console.error("Doctors fetch error:", err);
        setError("Unable to load doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // ==========================================
  // CATEGORIES
  // ==========================================

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        doctors
          .map((doctor) => doctor.category?.trim())
          .filter(Boolean)
      )
    ) as string[];

    return ["All", ...uniqueCategories.sort()];
  }, [doctors]);

  // ==========================================
  // FILTER DOCTORS
  // ==========================================

  const filteredDoctors = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesCategory =
        selectedCategory === "All" ||
        doctor.category === selectedCategory;

      const matchesSearch =
        !searchText ||
        doctor.name.toLowerCase().includes(searchText) ||
        doctor.specialization
          .toLowerCase()
          .includes(searchText) ||
        doctor.category
          ?.toLowerCase()
          .includes(searchText) ||
        doctor.qualification
          .toLowerCase()
          .includes(searchText) ||
        doctor.languages
          ?.toLowerCase()
          .includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [doctors, search, selectedCategory]);

  // ==========================================
  // BOOK APPOINTMENT
  // ==========================================

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
      setBookingError(
        "Please select an appointment date and time."
      );
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
    } catch (err) {
      console.error("Booking error:", err);

      setBookingError(
        err instanceof Error
          ? err.message
          : "Failed to book appointment"
      );
    } finally {
      setBooking(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-4 w-40 rounded bg-slate-200" />

            <div className="mt-4 h-10 w-72 rounded bg-slate-200" />

            <div className="mt-3 h-5 w-96 max-w-full rounded bg-slate-200" />

            <div className="mt-8 h-14 rounded-xl bg-slate-200" />

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-[520px] rounded-2xl bg-slate-200"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 px-4 py-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            CareConnect Healthcare
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Find a Doctor
          </h1>

          <div className="mt-8 rounded-2xl bg-white p-10 text-center shadow-sm">
            <p className="text-red-500">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* ====================================
            HEADER
        ==================================== */}

        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            CareConnect Healthcare
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Find a Doctor
          </h1>

          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            Find the right healthcare professional for
            your needs and book an appointment easily.
          </p>
        </div>

        {/* ====================================
            SEARCH
        ==================================== */}

        <div className="mb-6 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-slate-100 sm:p-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by doctor name, specialization, qualification..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-50"
            />

            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
              🔍
            </span>
          </div>
        </div>

        {/* ====================================
            CATEGORY FILTER
        ==================================== */}

        <div
          className="category-scroll mb-8 flex gap-2 overflow-x-auto pb-2"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                selectedCategory === category
                  ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                  : "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* ====================================
            RESULT INFO
        ==================================== */}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredDoctors.length}
            </span>{" "}
            healthcare professional
            {filteredDoctors.length !== 1 ? "s" : ""}
          </p>

          {(search || selectedCategory !== "All") && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ====================================
            NO RESULTS
        ==================================== */}

        {filteredDoctors.length === 0 ? (
          <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-100">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl">
              🔍
            </div>

            <h2 className="mt-5 text-xl font-bold text-slate-900">
              No doctors found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Try another search or select a different
              category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (

          /* ==================================
             DOCTOR GRID
          ================================== */

          <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor._id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-100 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                {/* ==================================
                    IMAGE
                ================================== */}

                <div className="relative p-3 pb-0">
                  <div className="relative h-64 overflow-hidden rounded-2xl bg-slate-100">
                    {doctor.profileImage ? (
                      <img
                        src={doctor.profileImage}
                        alt={doctor.name}
                        loading="lazy"
                        className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";

                          e.currentTarget.nextElementSibling?.classList.remove(
                            "hidden"
                          );
                        }}
                      />
                    ) : null}

                    {/* Image fallback */}

                    <div
                      className={`${
                        doctor.profileImage
                          ? "hidden"
                          : ""
                      } absolute inset-0 flex items-center justify-center bg-blue-50 text-6xl font-bold text-blue-600`}
                    >
                      {doctor.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    {/* Availability */}

                    <div className="absolute right-3 top-3">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-bold shadow-sm backdrop-blur ${
                          doctor.available
                            ? "bg-green-100/95 text-green-700"
                            : "bg-red-100/95 text-red-600"
                        }`}
                      >
                        {doctor.available
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ==================================
                    INFORMATION
                ================================== */}

                <div className="flex flex-1 flex-col p-5">

                  {/* Category */}

                  <p className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
                    {doctor.category ||
                      "Healthcare Professional"}
                  </p>

                  {/* Name */}

                  <h2 className="mt-1 min-h-[28px] text-xl font-bold leading-7 text-slate-900">
                    {doctor.name}
                  </h2>

                  {/* Specialization */}

                  <p className="mt-1 min-h-[42px] text-sm font-medium leading-5 text-slate-600">
                    {doctor.specialization}
                  </p>

                  {/* Details */}

                  <div className="mt-5 space-y-2.5 text-sm text-slate-600">

                    {doctor.qualification && (
                      <p className="leading-5">
                        <span className="font-bold text-slate-900">
                          Qualification:
                        </span>{" "}
                        {doctor.qualification}
                      </p>
                    )}

                    {doctor.languages && (
                      <p className="leading-5">
                        <span className="font-bold text-slate-900">
                          Languages:
                        </span>{" "}
                        {doctor.languages}
                      </p>
                    )}

                    {doctor.experience &&
                    doctor.experience > 0 ? (
                      <p className="leading-5">
                        <span className="font-bold text-slate-900">
                          Experience:
                        </span>{" "}
                        {doctor.experience}{" "}
                        {doctor.experience === 1
                          ? "year"
                          : "years"}
                      </p>
                    ) : null}

                    {doctor.consultationFee &&
                    doctor.consultationFee > 0 ? (
                      <p className="leading-5">
                        <span className="font-bold text-slate-900">
                          Consultation:
                        </span>{" "}
                        ₹{doctor.consultationFee}
                      </p>
                    ) : null}
                  </div>

                  {/* ==================================
                      BUTTON
                  ================================== */}

                  <div className="mt-auto pt-6">
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          !localStorage.getItem(
                            "token"
                          )
                        ) {
                          navigate("/login");
                          return;
                        }

                        setBookingError("");
                        setSelectedDoctor(doctor);
                      }}
                      disabled={!doctor.available}
                      className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:bg-slate-300"
                    >
                      {doctor.available
                        ? "Book Appointment"
                        : "Currently Unavailable"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================
          BOOKING MODAL
      ======================================== */}

      {selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/60 px-4 py-8 backdrop-blur-sm">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">

            {/* Header */}

            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Appointment
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  Book Appointment
                </h2>

                <p className="mt-2 font-semibold text-slate-700">
                  {selectedDoctor.name}
                </p>

                <p className="text-sm text-blue-600">
                  {selectedDoctor.specialization}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedDoctor(null);
                  setBookingError("");
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-500 hover:bg-slate-200 hover:text-slate-800"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Date */}

            <label className="mb-2 block text-sm font-bold text-slate-700">
              Appointment Date & Time
            </label>

            <input
              type="datetime-local"
              value={appointmentDate}
              min={new Date()
                .toISOString()
                .slice(0, 16)}
              onChange={(e) =>
                setAppointmentDate(e.target.value)
              }
              className="mb-5 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
            />

            {/* Reason */}

            <label className="mb-2 block text-sm font-bold text-slate-700">
              Reason for Visit
            </label>

            <textarea
              value={reason}
              onChange={(e) =>
                setReason(e.target.value)
              }
              placeholder="Describe your problem..."
              rows={4}
              className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-50"
            />

            {/* Error */}

            {bookingError && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600">
                {bookingError}
              </div>
            )}

            {/* Actions */}

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setSelectedDoctor(null);
                  setBookingError("");
                }}
                className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleBookAppointment}
                disabled={booking}
                className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {booking
                  ? "Booking..."
                  : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;