import React, { useState } from "react";

function Card({ image, title, address, price, state, city, category }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className="max-w-sm w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
      <div className="relative">
        <div className="rounded-lg overflow-hidden shadow-lg bg-white flex flex-col h-full transition-transform transform hover:scale-105 hover:shadow-2xl">
          <div className="aspect-w-16 aspect-h-12 h-48 relative">
            <img className="object-cover w-full h-full" src={image} alt={title} />
            <button
              onClick={toggleFavorite}
              className={`absolute top-2 right-2 bg-white p-1.5 rounded-3xl text-red-500 focus:outline-none`}
            >
              {isFavorite ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  />
                </svg>
              )}
            </button>
          </div>
          <div className="p-4 flex flex-col flex-grow">
            <div className="font-bold text-xl mb-2">{title}</div>
            <p className="text-gray-700 text-base mb-2">
              <span className="font-bold">Location:</span> {city}, {state}
            </p>
            <p className="text-gray-700 text-base mb-4">{address}</p>
            <div className="flex justify-between items-center mt-auto">
              <p className="text-red-500 font-bold text-lg">₹{price}</p>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Book Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
