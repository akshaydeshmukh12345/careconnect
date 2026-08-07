const Hero = () => {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center px-6">
        <div>
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
            Trusted Healthcare Platform
          </span>

          <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-900">
            Find the Right Doctor,
            <br />
            Anytime, Anywhere.
          </h1>

          <p className="mt-6 max-w-xl text-lg text-slate-600">
            Book appointments, consult experienced doctors online, and manage
            your healthcare in one secure place.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
              Book Appointment
            </button>

            <button className="rounded-xl border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-100">
              Video Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;