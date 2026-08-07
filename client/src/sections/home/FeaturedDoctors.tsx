const doctors = [
  {
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    experience: "12 Years",
    rating: "4.9",
    image: "👩‍⚕️",
  },
  {
    name: "Dr. Michael Lee",
    specialty: "Neurologist",
    experience: "10 Years",
    rating: "4.8",
    image: "👨‍⚕️",
  },
  {
    name: "Dr. Emily Brown",
    specialty: "Pediatrician",
    experience: "8 Years",
    rating: "4.9",
    image: "👩‍⚕️",
  },
];

const FeaturedDoctors = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
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

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {doctors.map((doctor) => (
            <div
              key={doctor.name}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="flex justify-center text-7xl">
                {doctor.image}
              </div>

              <h3 className="mt-6 text-center text-2xl font-bold">
                {doctor.name}
              </h3>

              <p className="mt-2 text-center text-blue-600">
                {doctor.specialty}
              </p>

              <div className="mt-6 flex justify-between text-sm text-slate-500">
                <span>{doctor.experience}</span>
                <span>⭐ {doctor.rating}</span>
              </div>

              <button className="mt-8 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700">
                Book Appointment
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedDoctors;