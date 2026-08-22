import heroImg from "../../assets/hero.png";
import HeroCard from "./HeroCard";

const HeroImage = () => {
  return (
    <div className="relative flex items-center justify-center">

      <div className="rounded-[40px] bg-gradient-to-br from-blue-100 to-blue-300 p-10 shadow-2xl">
        <img
          src={heroImg}
          alt="Doctor"
          className="w-[330px]"
        />
      </div>

      <div className="absolute -top-6 -left-10">
        <HeroCard
          title="Patient Rating"
          value="⭐ 4.9"
        />
      </div>

      <div className="absolute -bottom-6 -right-10">
        <HeroCard
          title="Appointments"
          value="5000+"
        />
      </div>

    </div>
  );
};

export default HeroImage;
