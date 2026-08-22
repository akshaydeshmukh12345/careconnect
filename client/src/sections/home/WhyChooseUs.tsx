import {
  ShieldCheck,
  CalendarCheck,
  Video,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Trusted Doctors",
    description: "Verified and experienced healthcare professionals.",
  },
  {
    icon: CalendarCheck,
    title: "Easy Booking",
    description: "Book appointments in just a few clicks.",
  },
  {
    icon: Video,
    title: "Video Consultation",
    description: "Consult doctors from the comfort of your home.",
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "We're always available whenever you need us.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Why Choose Us
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            Healthcare Made Simple
          </h2>

          <p className="mt-4 text-slate-500">
            Everything you need for better healthcare in one place.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-2xl bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>

                <h3 className="mt-6 text-xl font-bold">
                  {feature.title}
                </h3>

                <p className="mt-4 text-slate-500">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhyChooseUs;
