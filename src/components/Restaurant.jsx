import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";

export default function TopRest() {
  const [restaurants, setRestaurants] = useState([]);

  /* =====================
     FETCH API DATA
     ===================== */
  useEffect(() => {
    fetch("https://swiggy-api-fpi2.onrender.com/top-restaurant-chains")
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto mt-12">
      {/* DIVIDER */}
      <div className="border-t border-gray-300 mb-8"></div>

      {/* HEADER */}
      <h2 className="text-[25px] font-bold mb-6">
        Restaurants with online food delivery in Bangalore
      </h2>

      {/* GRID (4 PER ROW) */}
      <div className="grid grid-cols-4 gap-6">
        {restaurants.map((item, index) => (
          <div
            key={index}
            className="rounded-xl overflow-hidden hover:scale-[1.02] transition-transform"
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
              <h3 className="font-bold text-lg truncate">
                {item.title}
              </h3>

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
  );
}
