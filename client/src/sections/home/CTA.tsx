const CTA = () => {
  return (
    <section className="bg-blue-600 py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">

        <h2 className="text-4xl font-bold text-white lg:text-5xl">
          Ready to Take Care of Your Health?
        </h2>

        <p className="mt-6 text-lg leading-8 text-blue-100">
          Book appointments with trusted doctors, consult online,
          and manage your healthcare from one place.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <button className="rounded-xl bg-white px-8 py-4 font-semibold text-blue-600 transition hover:scale-105">
            Book Appointment
          </button>

          <button className="rounded-xl border border-white px-8 py-4 font-semibold text-white transition hover:bg-white hover:text-blue-600">
            Explore Doctors
          </button>

        </div>

      </div>
    </section>
  );
};

export default CTA;
