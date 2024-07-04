import React, { useRef, useEffect } from "react";
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import car1 from '../../components/assets/car1.jpg';
import car2 from '../../components/assets/car2.jpg';
import car3 from '../../components/assets/car3.jpg';
import car4 from '../../components/assets/car4.jpg';
import car5 from '../../components/assets/car5.jpg';
import car6 from '../../components/assets/car6.jpg';
import car7 from '../../components/assets/car7.jpg';

const slides = [
  { img: car1, title: "Explore the Himalayas", desc: "Discover the stunning landscapes of the Himalayas." },
  { img: car2, title: "The Taj Mahal", desc: "Witness the grandeur of the Taj Mahal." },
  { img: car3, title: "Kerala Backwaters", desc: "Relax in Kerala's serene backwaters and houseboats." },
  { img: car4, title: "Jama Masjid", desc: "Marvel at Delhi's grand Jama Masjid mosque." },
  { img: car5, title: "Munnar Hills", desc: "Enjoy the lush green hills of Munnar." },
  { img: car6, title: "Victoria Memorial Hall", desc: "Iconic Kolkata monument with museum and gardens." },
  { img: car7, title: "Mysore Palace", desc: "Explore the majestic Mysore Palace in Karnataka." },
];

const CarouselComponent = () => {
  const carouselRef = useRef(null);
  const intervalRef = useRef(null);

  const startCarousel = () => {
    intervalRef.current = setInterval(() => {
      carouselRef.current.next();
    }, 5000);
  };

  useEffect(() => {
    startCarousel();

    const handleMouseEnter = () => clearInterval(intervalRef.current);
    const handleMouseLeave = startCarousel;

    const carouselElement = carouselRef.current;

    if (carouselElement) {
      carouselElement.addEventListener('mouseenter', handleMouseEnter);
      carouselElement.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      clearInterval(intervalRef.current);
      if (carouselElement) {
        carouselElement.removeEventListener('mouseenter', handleMouseEnter);
        carouselElement.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="mt-24 relative">
      <div ref={carouselRef} style={{ pointerEvents: 'auto' }}>
        <Carousel
          showThumbs={false}
          autoPlay
          infiniteLoop
          interval={5000}
          transitionTime={500}
          showStatus={false}
          showArrows
        >
          {slides.map((slide, index) => (
            <div key={index}>
              <img src={slide.img} alt={`Carousel image ${index + 1}`} className="w-full h-[600px] object-cover" />
              <div className="absolute inset-0 flex flex-col justify-center  text-white bg-black bg-opacity-50 p-4">
                <h2 className="text-4xl  font-bold">{slide.title}</h2>
                <p className="text-xl">{slide.desc}</p>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default CarouselComponent;
