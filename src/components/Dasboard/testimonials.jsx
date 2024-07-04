import React, { useState, useEffect } from 'react';
import Raj from '../../components/assets/Raj_Kumar.jpg';
import Neha from '../../components/assets/Neha_Sharma.jpg';
import Priya from '../../components/assets/Priya_Gupta.jpg';
import Aditya from '../../components/assets/Aditya_Kapoor.jpg';
import Sadiq from '../../components/assets/Sadiq_Basha.jpg';
import Nayum from '../../components/assets/Nayum.jpg';
import Aisha from '../../components/assets/Aisha.jpg';
import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const TestimonialsSlider = () => {
    const testimonials = [
        {
            quote: "The Books Adda has a fantastic selection of books. I found everything I was looking for and more. The staff were very helpful and knowledgeable.",
            author: "Raj Kumar",
            city: "Delhi",
            image: Raj,
            rating: 4
        },
        {
            quote: "I love the cozy atmosphere of this Books Adda. It's my go-to place for finding new reads and getting recommendations from the friendly staff.",
            author: "Neha Sharma",
            city: "Mumbai",
            image: Neha,
            rating: 4.5
        },
        {
            quote: "The Books Adda's collection is impressive, and I always find what I need. The events they host are also a great way to meet fellow book lovers.",
            author: "Priya Gupta",
            city: "Punjab",
            image: Priya,
            rating: 5
        },
        {
            quote: "I had a great experience at the Books Adda. The staff helped me find a rare book that I had been searching for. Highly recommend this place.",
            author: "Aditya Kapoor",
            city: "Chennai",
            image: Aditya,
            rating: 3.5
        },
        {
            quote: "The Books Adda offers a wide range of genres and the staff's recommendations are always spot on. I always leave with a new favorite book.",
            author: "Sadiq Basha",
            city: "Bangalore",
            image: Sadiq,
            rating: 4.0
        },
        {
            quote: 'I had an incredible experience at the Books Adda. The personalized service and vast selection made my visit truly enjoyable. I highly recommend it to all book lovers.',
            author: "Nayum",
            city: "Hyderabad",
            image: Nayum,
            rating: 5
        },
        {
            quote: "The Books Adda's ambiance is perfect for spending a quiet afternoon reading. The staff is always ready to help and their book recommendations are great.",
            author: "Aisha Khan",
            city: "Vizag",
            image: Aisha,
            rating: 4.5
        }
    ];

    const [currentSlide, setCurrentSlide] = useState(0);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide === testimonials.length - 1 ? 0 : prevSlide + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide === 0 ? testimonials.length - 1 : prevSlide - 1));
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} className="w-6 h-6 fill-current text-yellow-500" />);
            } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
                stars.push(<FaStarHalfAlt key={i} className="w-6 h-6 fill-current text-yellow-500" />);
            } else {
                stars.push(<FaRegStar key={i} className="w-6 h-6 fill-current text-yellow-500" />);
            }
        }
        return stars;
    };

    return (
        <section className="py-8 shadow-5xl border  ">
            <div className="max-w-3xl mx-auto relative">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">What Our Customers Say</h2>
                <p className="text-center text-xl text-gray-600 mb-1 md:mb-1">Hear from our happy customers about their experiences with our Books Adda.</p>
                <div className="overflow-hidden">
                    <div className="flex transition-transform ease-in-out duration-1000" style={{ transform: `translateX(-${currentSlide * 100}%)`, scrollBehavior: 'smooth' }}>
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="w-full flex-shrink-0 flex items-center justify-center px-8 py-8">
                                <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto flex flex-col items-center">
                                    <img src={testimonial.image} alt={testimonial.author} className="w-28 h-28 rounded-full mb-4 object-cover" />
                                    <div className="text-lg text-center italic text-gray-700 mb-4">{testimonial.quote}</div>
                                    <div className="flex mb-2">
                                        {renderStars(testimonial.rating)}
                                    </div>
                                    <div className="text-gray-800 text-lg font-semibold">{testimonial.author}</div>
                                    <div className="text-gray-800 ">{testimonial.city}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <button className="absolute top-[60%] transform -translate-y-1/2 left-0 w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 focus:outline-none" onClick={prevSlide}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button className="absolute top-[60%] transform -translate-y-1/2 right-0 w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 focus:outline-none" onClick={nextSlide}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default TestimonialsSlider;
