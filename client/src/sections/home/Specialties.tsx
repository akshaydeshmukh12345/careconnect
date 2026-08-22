const specialties = [
  {
    icon: "❤️",
    title: "Cardiology",
  },
  {
    icon: "🧠",
    title: "Neurology",
  },
  {
    icon: "🦴",
    title: "Orthopedic",
  },
  {
    icon: "👶",
    title: "Pediatrics",
  },
  {
    icon: "👁️",
    title: "Ophthalmology",
  },
  {
    icon: "🦷",
    title: "Dental",
  },
];

const Specialties = () => {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">

        {/* Heading */}
        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Medical Specialties
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            Find the Right Specialist
          </h2>

          <p className="mt-4 text-slate-500">
            Choose from our experienced healthcare specialists.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {specialties.map((item) => (
            <div
              key={item.title}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-10 text-center transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:border-blue-500 hover:shadow-2xl"
            >
              <div className="text-6xl">
                {item.icon}
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-800">
                {item.title}
              </h3>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Specialties;
