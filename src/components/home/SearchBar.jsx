import React, { useState } from "react";

const statesInIndia = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharastra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Orissa", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

function SearchBar({ searchTerm, setSearchTerm, selectedState, setSelectedState }) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const handleSearchClick = () => {
    setIsSearchExpanded(true);
  };

  const handleInputBlur = () => {
    if (!searchTerm) {
      setIsSearchExpanded(false);
    }
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <select
        className="border-2 border-black border-solid rounded py-2 px-6"
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
      >
        <option value="">Select State</option>
        {statesInIndia.map(state => (
          <option key={state} value={state}>{state}</option>
        ))}
      </select>
      {!isSearchExpanded && (
        <button
          onClick={handleSearchClick}
          className="border-2 border-black border-solid rounded py-2 px-4 bg-white flex  items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5A7 7 0 1111 4a7 7 0 016 11z"
            />
          </svg>
        </button>
      )}
      {isSearchExpanded && (
        <input
          type="text"
          placeholder="Search by title or category..."
          className="border-2 border-black border-solid rounded py-2 px-4  transition-all duration-500 ml-4 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onBlur={handleInputBlur}
          autoFocus
        />
      )}
    </div>
  );
}

export default SearchBar;
