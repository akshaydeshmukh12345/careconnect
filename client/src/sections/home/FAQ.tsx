import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "How do I book an appointment?",
    answer:
      "Search for a doctor, choose an available slot, and confirm your appointment in a few simple steps.",
  },
  {
    question: "Can I consult a doctor online?",
    answer:
      "Yes. CareConnect provides secure video consultations with experienced doctors.",
  },
  {
    question: "Are my medical records secure?",
    answer:
      "Absolutely. Your personal and medical information is securely stored and protected.",
  },
  {
    question: "Can I cancel or reschedule an appointment?",
    answer:
      "Yes. You can manage your appointments from your dashboard after logging in.",
  },
];

const FAQ = () => {
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-4xl px-6">

        <div className="text-center">
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            FAQ
          </span>

          <h2 className="mt-5 text-4xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>

          <p className="mt-4 text-slate-500">
            Find answers to the most common questions about CareConnect.
          </p>
        </div>

        <div className="mt-16 space-y-5">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-2xl border border-slate-200 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {faq.question}
                </h3>

                <ChevronDown className="h-5 w-5 text-slate-500" />
              </div>

              <p className="mt-4 leading-7 text-slate-600">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;