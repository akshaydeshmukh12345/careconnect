const HeroSearch = () => {
  return (
    <div className="mt-8 flex w-full overflow-hidden rounded-2xl bg-white shadow-xl">
      <input
        type="text"
        placeholder="Search doctors, specialties..."
        className="flex-1 px-5 py-4 outline-none"
      />

      <button className="bg-blue-600 px-8 font-semibold text-white hover:bg-blue-700">
        Search
      </button>
    </div>
  );
};

export default HeroSearch;