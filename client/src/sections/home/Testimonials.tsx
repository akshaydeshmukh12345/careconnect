import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Akash Sharma",
    review:
      "Booking an appointment was incredibly easy. The doctor was professional and explained everything clearly.",
  },
  {
    name: "Priya Verma",
    review:
      "The online consultation saved me a lot of time. The overall experience was smooth and stress-free.",
  },
  {
    name: "Rahul Mehta",
    review:
      "Excellent service and friendly doctors. I would definitely recommend CareConnect to my family and friends.",
  },
];

const Testimonials = () => {
  return (
    <section className="bg-slate-50 py-24">
      <div className="mx-auto max-w-7xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Testimonials
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            What Our Patients Say
          </h2>

          <p className="mt-4 text-slate-500">
            Trusted by thousands of happy patients across India.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="mb-6 flex gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star
                    key={index}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>

              <p className="leading-7 text-slate-600">
                "{item.review}"
              </p>

              <div className="mt-8">
                <h3 className="font-bold text-slate-900">
                  {item.name}
                </h3>

                <p className="text-sm text-slate-500">
                  Verified Patient
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;