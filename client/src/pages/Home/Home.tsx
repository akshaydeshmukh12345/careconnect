import Hero from "../../sections/home/Hero";
import Specialties from "../../sections/home/Specialties";

import FeaturedDoctors from "../../sections/home/FeaturedDoctors";

import WhyChooseUs from "../../sections/home/WhyChooseUs";

import Testimonials from "../../sections/home/Testimonials";

import FAQ from "../../sections/home/FAQ";

import CTA from "../../sections/home/CTA";

const Home = () => {
  return (
    <>
      <Hero />
      <Specialties />
      <FeaturedDoctors />
      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <CTA />
    </>
  );
};

export default Home;