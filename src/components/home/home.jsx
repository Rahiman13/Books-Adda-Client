import React, { useState } from "react";
import CarouselDarkVariant from "./Carousel";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import Services from "./services";
import Testimonials from "./testimonials";
import Contact from "./ContactUs";
import './home.css';
import NavBar from "../Navbar/Navbar";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");

  return (
    <>
    <NavBar />
    <div className="min-h-screen flex flex-col">
      <CarouselDarkVariant />
      <div className="flex-grow">
        <div className="container mx-auto px-8 py-8">
          <h1 className="text-3xl font-bold mb-4">Top Places in India</h1>
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            selectedState={selectedState} 
            setSelectedState={setSelectedState} 
          />
          <SearchResults searchTerm={searchTerm} selectedState={selectedState} />
        </div>
      </div>
      <Services />
      <Testimonials />
      <Contact />
    </div>
    </>
  );
}
