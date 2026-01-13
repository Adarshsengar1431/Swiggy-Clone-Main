import React, { useEffect, useRef, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function Category() {
  const [Category, setCategory] = useState([]);
  const [slide, setSlide] = useState(0);

  const startX = useRef(0);
  const isDragging = useRef(false);

  // Smooth scroll refs
  const velocity = useRef(0);
  const rafId = useRef(null);

  const ITEM_WIDTH = 150;
  const VISIBLE_ITEMS = 8;

  const maxSlide =
    Math.max(Category.length - VISIBLE_ITEMS, 0) * ITEM_WIDTH;

  useEffect(() => {
    fetch("https://swiggy-api-fpi2.onrender.com/categories/")
      .then(res => res.json())
      .then(data => setCategory(data));
  }, []);

  /* =====================
     INERTIA ENGINE
     ===================== */
  const startInertia = () => {
    cancelAnimationFrame(rafId.current);

    const animate = () => {
      velocity.current *= 0.92; // friction

      setSlide(prev => {
        let next = prev + velocity.current;
        if (next < 0) next = 0;
        if (next > maxSlide) next = maxSlide;
        return next;
      });

      if (Math.abs(velocity.current) > 0.1) {
        rafId.current = requestAnimationFrame(animate);
      }
    };

    rafId.current = requestAnimationFrame(animate);
  };

  /* =====================
     ARROWS (ONE BY ONE)
     ===================== */
  const slideRight = () => {
    cancelAnimationFrame(rafId.current);
    velocity.current = 0;
    setSlide(prev => Math.min(prev + ITEM_WIDTH, maxSlide));
  };

  const slideLeft = () => {
    cancelAnimationFrame(rafId.current);
    velocity.current = 0;
    setSlide(prev => Math.max(prev - ITEM_WIDTH, 0));
  };

  /* =====================
     TRACKPAD
     ===================== */
  const onWheel = (e) => {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return;

    e.preventDefault();
    e.stopPropagation();

    velocity.current += e.deltaX * 0.4;
    startInertia();
  };

  /* =====================
     TOUCH
     ===================== */
  const onTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const onTouchMove = (e) => {
    if (!isDragging.current) return;

    const currentX = e.touches[0].clientX;
    const diff = startX.current - currentX;

    velocity.current = diff * 0.6;
    startX.current = currentX;
  };

  const onTouchEnd = () => {
    isDragging.current = false;
    startInertia();
  };

  /* =====================
     MOUSE DRAG
     ===================== */
  const onMouseDown = (e) => {
    startX.current = e.clientX;
    isDragging.current = true;
  };

  const onMouseMove = (e) => {
    if (!isDragging.current) return;

    const diff = startX.current - e.clientX;
    velocity.current = diff * 0.6;
    startX.current = e.clientX;
  };

  const stopDrag = () => {
    isDragging.current = false;
    startInertia();
  };

  return (
    <div className="max-w-[1200px] mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center my-5">
        <h2 className="text-[25px] font-bold">
          Whats on your mind?
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
      <div
        className="overflow-hidden cursor-grab no-browser-swipe"
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${slide}px)` }}
        >
          {Category.map((cat, index) => (
            <div
              key={index}
              className="w-[150px] shrink-0 text-center"
            >
              <img
                src={`https://swiggy-api-fpi2.onrender.com/images/${cat.image}`}
                alt={cat.path}
                draggable={false}
                className="w-[120px] h-[120px] mx-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
