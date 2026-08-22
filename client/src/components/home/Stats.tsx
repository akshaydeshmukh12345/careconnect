const stats = [
  {
    number: "5000+",
    label: "Doctors",
  },
  {
    number: "50+",
    label: "Hospitals",
  },
  {
    number: "100K+",
    label: "Happy Patients",
  },
];

const Stats = () => {
  return (
    <div className="mt-10 grid grid-cols-3 gap-6">
      {stats.map((item) => (
        <div key={item.label}>
          <h3 className="text-4xl font-bold text-blue-600">
            {item.number}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Stats;
