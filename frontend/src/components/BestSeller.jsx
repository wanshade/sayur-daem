import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "../context/AppContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

const BestSeller = () => {
  const { products } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(4);

  // Responsive items per slide
  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 768) {
        // sm breakpoint
        setItemsToShow(2);
      } else if (window.innerWidth < 1024) {
        // md breakpoint
        setItemsToShow(3);
      } else {
        // lg breakpoint and above
        setItemsToShow(4);
      }
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, []);

  const bestSellerProducts = products
    .filter((product) => product.inStock)
    .slice(0, 8); // Always get 8 products
  const totalSlides = Math.ceil(bestSellerProducts.length / itemsToShow);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex) => {
    setCurrentSlide(slideIndex);
  };

  const getItemWidth = () => {
    if (itemsToShow === 2) return "w-1/2";
    if (itemsToShow === 3) return "w-1/3";
    return "w-1/4";
  };

  if (bestSellerProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <p className="text-2xl md:text-3xl font-medium">BestSeller</p>

        {/* Navigation Arrows */}
        {totalSlides > 1 && (
          <div className="flex gap-2">
            <button
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Slide Container */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0 flex">
              {bestSellerProducts
                .slice(slideIndex * itemsToShow, (slideIndex + 1) * itemsToShow)
                .map((product, index) => (
                  <div
                    key={index}
                    className={`${getItemWidth()} flex-shrink-0 px-2`}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-gray-800" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BestSeller;
