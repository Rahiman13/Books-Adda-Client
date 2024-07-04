import React, { useEffect, useRef, useState } from "react";
import { TECarousel, TECarouselItem } from "tw-elements-react";
import car1 from '../../components/assets/car1.jpg';
import car2 from '../../components/assets/car2.jpg';
import car3 from '../../components/assets/car3.jpg';
import car4 from '../../components/assets/car4.jpg';
import car5 from '../../components/assets/car5.jpg';
import car6 from '../../components/assets/car6.jpg';
import car7 from '../../components/assets/car7.jpg';
import './home.css';

const slides = [
  { img: car1, title: "Explore the Himalayas", desc: "Discover the stunning landscapes of the Himalayas." },
  { img: car2, title: "The Taj Mahal", desc: "Witness the grandeur of the Taj Mahal." },
  { img: car3, title: "Kerala Backwaters", desc: "Relax in Kerala's serene backwaters and houseboats." },
  { img: car4, title: "Jama Masjid", desc: "Marvel at Delhi's grand Jama Masjid mosque." },
  { img: car5, title: "Munnar Hills", desc: "Enjoy the lush green hills of Munnar." },
  { img: car6, title: "Victoria Memorial Hall", desc: "Iconic Kolkata monument with museum and gardens." },
  { img: car7, title: "Mysore Palace", desc: "Explore the majestic Mysore Palace in Karnataka." },
];

function CarouselDarkVariant() {
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);

  const startCarousel = () => {
    intervalRef.current = setInterval(() => {
      const nextButton = carouselRef.current.querySelector('[data-te-carousel-control-next]');
      if (nextButton) nextButton.click();
    }, 5000);
  };

  useEffect(() => {
    startCarousel();

    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div ref={carouselRef} style={{ pointerEvents: 'none' }}>
      <TECarousel
        className="mt-20 sm:mt-20 md:mt-22 lg:mt-20 mt-320px-64"
        showControls
        showIndicators
        crossfade
        ride="carousel"
        interval={5000}
        prevBtnIcon={
          <>
            <span className="inline-block hidden text-black h-8 w-8 [&>svg]:h-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </span>
            <span className="sr-only">Previous</span>
          </>
        }
        nextBtnIcon={
          <>
            <span className="inline-block hidden text-black h-8 w-8 [&>svg]:h-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </span>
            <span className="sr-only">Next</span>
          </>
        }
        theme={{
          indicator:
            "mx-[3px] box-content h-[3px] w-[30px] flex-initial cursor-pointer border-0 border-y-[10px] border-solid border-transparent bg-black bg-clip-padding p-0 -indent-[999px] opacity-50 transition-opacity duration-[600ms] ease-[cubic-bezier(0.25,0.1,0.25,1.0)] motion-reduce:transition-none",
        }}
      >
        <div className="relative w-full h-[150px] sm:h-[250px] md:h-[400px] lg:h-[500px] overflow-hidden after:clear-both after:block after:content-['']">
          {slides.map((slide, index) => (
            <TECarouselItem
              key={index}
              itemID={index + 1}
              className="relative float-left -mr-[100%] hidden w-full !transform-none transition-opacity duration-[600ms] ease-in-out motion-reduce:transition-none"
            >
              <img
                src={slide.img}
                className="block w-full h-full object-cover"
                alt={`Slide ${index + 1}`}
              />
              <div className="absolute text-center w-full top-2 left-0 sm:top-24 md:top-60 lg:top-80 py-5 text-white">
                <h5 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold pb-2">
                  {slide.title}
                </h5>
                <p className="bg-gray-900 text-xs sm:text-sm md:text-base lg:text-lg bg-opacity-60 p-1 sm:p-2 md:p-4 rounded inline-block typewriter">
                  {slide.desc}
                </p>
              </div>
            </TECarouselItem>
          ))}
        </div>
      </TECarousel>
    </div>
  );
}

function Card({ image, title, address, price, state, city, category }) {
  return (
    <div className="max-w-sm w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
      <div className="rounded-lg overflow-hidden shadow-lg bg-white flex flex-col h-full transition-transform transform hover:scale-105 hover:shadow-2xl">
        <div className="aspect-w-16 aspect-h-12 h-48">
          <img className="object-cover w-full h-full" src={image} alt={title} />
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
  );
}

function SearchResults({ searchTerm }) {
  const [results, setResults] = useState([]);
  const [allResults, setAllResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://tourism-and-travel-management-system.onrender.com/public/trip/');
        const data = await response.json();
        const enhancedData = data.map(post => ({
          id: post.tripId,
          title: post.tripName,
          image: post.url,
          address: post.tripAddress,
          price: post.tripPrice,
          state: post.stateName,
          city: post.cityName,
          category: post.categoryName,
        }));
        setResults(enhancedData);
        setAllResults(enhancedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filteredResults = allResults.filter(result =>
        result.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filteredResults);
    } else {
      setResults(allResults);
    }
  }, [searchTerm, allResults]);

  return (
    <div className="flex flex-wrap justify-center">
      {results.map((result) => (
        <Card
          key={result.id}
          image={result.image}
          title={result.title}
          city={result.city}
          state={result.state}
          category={result.category}
          address={result.address}
          price={result.price}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
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
    <div className="min-h-screen flex flex-col">
      <CarouselDarkVariant />
      <div className="flex-grow">
        <div className="container mx-auto px-8 py-8">
          <h1 className="text-3xl font-bold mb-4">Top Places in India</h1>
          <div className="flex justify-end mb-4">
            {!isSearchExpanded && (
              <button
                onClick={handleSearchClick}
                className="border-2 border-black border-solid rounded py-2 px-4 bg-white flex items-center"
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
                placeholder="Search..."
                className="border-2 border-black border-solid rounded py-2 px-4 transition-all duration-500 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onBlur={handleInputBlur}
                autoFocus
              />
            )}
          </div>
          <SearchResults searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
}
