import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

function Slider() {

  const slides = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop",
      title: "We Picked Every Item With Care",
      heading: "You Must Try",
      description: "Use this code to receive 50% discount off all products",
      button: "Go To Collection",
    },

    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1523398002811-999ca8dec234?q=80&w=1600&auto=format&fit=crop",
      title: "New Fashion Collection",
      heading: "Summer Sale",
      description: "Discover trending products with huge discounts",
      button: "Shop Now",
    },

    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
      title: "Premium Quality Products",
      heading: "Latest Arrivals",
      description: "Find your perfect style with our new arrivals",
      button: "Explore",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // NEXT SLIDE
  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  // PREVIOUS SLIDE
  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  // AUTO SLIDE
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[250px] sm:h-[350px] md:h-[550px] overflow-hidden">

      {/* SLIDES */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700
          ${currentSlide === index ? "opacity-100" : "opacity-0"}`}
        >

          {/* IMAGE */}
          <img
            src={slide.image}
            alt={slide.heading}
            className="w-full h-full object-cover"
          />

          {/* OVERLAY */}
          <div className="absolute inset-0 bg-black/20" />

          {/* CONTENT */}
          <div className="absolute top-1/2 left-6 sm:left-12 -translate-y-1/2 text-white max-w-lg">

            <p className="text-sm sm:text-xl mb-2">
              {slide.title}
            </p>

            <h1 className="text-2xl sm:text-5xl font-bold mb-3">
              {slide.heading}
            </h1>

            <p className="text-xs sm:text-base mb-6 text-gray-200">
              {slide.description}
            </p>

            <button className="bg-black hover:bg-gray-900 transition px-5 py-3 rounded-md text-sm font-semibold">
              {slide.button}
            </button>

          </div>
        </div>
      ))}

      {/* LEFT BUTTON */}
      <button
        onClick={prevSlide}
        className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-md flex items-center justify-center"
      >
        <FaArrowLeft />
      </button>

      {/* RIGHT BUTTON */}
      <button
        onClick={nextSlide}
        className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white w-10 h-10 rounded-md flex items-center justify-center"
      >
        <FaArrowRight />
      </button>

      {/* DOTS */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">

        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition
            ${
              currentSlide === index
                ? "bg-white"
                : "bg-white/50"
            }`}
          />
        ))}

      </div>
    </div>
  );
}

export default Slider;