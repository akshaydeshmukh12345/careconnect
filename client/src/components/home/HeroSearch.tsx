import { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSearch = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmedSearch = search.trim();

    if (!trimmedSearch) {
      navigate("/doctors");
      return;
    }

    navigate(
      `/doctors?search=${encodeURIComponent(trimmedSearch)}`
    );
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="mt-8 flex w-full overflow-hidden rounded-2xl bg-white shadow-xl">
      <input
        type="text"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search doctors, specialties..."
        className="flex-1 px-5 py-4 outline-none"
      />

      <button
        type="button"
        onClick={handleSearch}
        className="bg-blue-600 px-8 font-semibold text-white transition hover:bg-blue-700"
      >
        Search
      </button>
    </div>
  );
};

export default HeroSearch;