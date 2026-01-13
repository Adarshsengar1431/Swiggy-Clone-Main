import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight, FaStar } from "react-icons/fa";

export default function TopRest() {
  const [restaurants, setRestaurants] = useState([]);
  const [slide, setSlide] = useState(0);

  const ITEM_WIDTH = 300;
  const VISIBLE_ITEMS = 4;

  const maxSlide =
    Math.max(restaurants.length - VISIBLE_ITEMS, 0) * ITEM_WIDTH;

  /* =====================
     FETCH API DATA
     ===================== */
  useEffect(() => {
    fetch("https://swiggy-api-fpi2.onrender.com/top-restaurant-chains")
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error(err));
  }, []);

  /* =====================
     ARROWS (ONE BY ONE)
     ===================== */
  const slideLeft = () => {
    setSlide(prev => Math.max(prev - ITEM_WIDTH, 0));
  };

  const slideRight = () => {
    setSlide(prev => Math.min(prev + ITEM_WIDTH, maxSlide));
  };

  return (
    <div className="max-w-[1200px] mx-auto mt-12">
      {/* DIVIDER */}
      <div className="border-t border-gray-300 mb-8"></div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-[25px] font-bold">
          Top restaurant chains in Bangalore
        </h2>

        <div className="flex">
          <button
            onClick={slideLeft}
            disabled={slide === 0}
            className={`w-[30px] h-[30px] mx-2 rounded-full flex items-center justify-center
              ${slide === 0 ? "bg-gray-300 cursor-not-allowed" : "bg-[#e2e2e7]"}`}
          >
            <FaArrowLeft />
          </button>

          <button
            onClick={slideRight}
            disabled={slide === maxSlide}
            className={`w-[30px] h-[30px] mx-2 rounded-full flex items-center justify-center
              ${slide === maxSlide ? "bg-gray-300 cursor-not-allowed" : "bg-[#e2e2e7]"}`}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* SLIDER */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${slide}px)` }}
        >
          {restaurants.map((item, index) => (
            <div
              key={index}
              className="w-[300px] shrink-0 px-3"
            >
              {/* IMAGE */}
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={`https://swiggy-api-fpi2.onrender.com/images/${item.image}`}
                  alt={item.title}
                  className="w-full h-[180px] object-cover"
                />

                {/* OFFER */}
                <div className="absolute bottom-2 left-2 text-white font-bold text-sm bg-black/60 px-2 py-1 rounded">
                  {item.offer}
                </div>
              </div>

              {/* DETAILS */}
              <div className="mt-3">
                <h3 className="font-bold text-lg">{item.title}</h3>

                <div className="flex items-center text-sm mt-1">
                  <FaStar className="text-green-600 mr-1" />
                  <span className="font-semibold">{item.rating}</span>
                  <span className="mx-2">•</span>
                  <span>
                    {item.minTime}-{item.maxTime} mins
                  </span>
                </div>

                <p className="text-gray-600 text-sm truncate">
                  {item.name}
                </p>
                <p className="text-gray-500 text-sm">
                  {item.place}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
