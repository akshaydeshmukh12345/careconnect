import HeroImage from "../../components/home/HeroImage";
import HeroSearch from "../../components/home/HeroSearch";
import Stats from "../../components/home/Stats";

const Hero = () => {
  return (
    <section className="bg-slate-50 pb-8">
      <div className="mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-between gap-16 px-6 py-16 lg:flex-row">

        {/* Left Side */}
        <div className="flex-1">

          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Trusted Healthcare Platform
          </span>

          <h1 className="mt-6 text-5xl font-extrabold leading-tight text-slate-900 lg:text-6xl">
            Find the Right Doctor,
            <br />
            Anytime, Anywhere.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Book appointments, consult experienced doctors online,
            and manage your healthcare in one secure place.
          </p>

          <HeroSearch />

          <div className="mt-8 flex flex-wrap gap-4">
            <button className="rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-blue-700">
              Book Appointment
            </button>

            <button className="rounded-xl border border-slate-300 px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 hover:bg-slate-100">
              Video Consultation
            </button>
          </div>

          <div className="mt-12">
            <Stats />
          </div>

        </div>

        {/* Right Side */}
        <div className="flex flex-1 justify-center">
          <HeroImage />
        </div>

      </div>
    </section>
  );
};

export default Hero;