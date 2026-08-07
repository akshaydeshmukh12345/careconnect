interface HeroCardProps {
  title: string;
  value: string;
}

const HeroCard = ({ title, value }: HeroCardProps) => {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl">
      <h3 className="text-2xl font-bold text-blue-600">{value}</h3>

      <p className="text-sm text-slate-500">{title}</p>
    </div>
  );
};

export default HeroCard;