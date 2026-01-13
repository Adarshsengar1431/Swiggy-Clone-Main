import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#02060c] text-gray-400 mt-20">
      <div className="max-w-[1200px] mx-auto px-6 py-16">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 border-b border-gray-700 pb-10">
          
          {/* BRAND */}
          <div>
            <h2 className="text-white text-2xl font-bold mb-3">
              Swiggy
            </h2>
            <p className="text-sm">
              © 2026 Swiggy Clone <br />
              Made By Adarsh S Sengar
            </p>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-white cursor-pointer">About</li>
              <li className="hover:text-white cursor-pointer">Careers</li>
              <li className="hover:text-white cursor-pointer">Team</li>
              <li className="hover:text-white cursor-pointer">Swiggy One</li>
            </ul>
          </div>

          {/* CONTACT */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-white cursor-pointer">Help & Support</li>
              <li className="hover:text-white cursor-pointer">Partner with us</li>
              <li className="hover:text-white cursor-pointer">Ride with us</li>
            </ul>
          </div>

          {/* LEGAL */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3 text-sm">
              <li className="hover:text-white cursor-pointer">Terms & Conditions</li>
              <li className="hover:text-white cursor-pointer">Privacy Policy</li>
              <li className="hover:text-white cursor-pointer">Cookie Policy</li>
            </ul>
          </div>
        </div>

        {/* CITIES */}
        <div className="pt-10">
          <h3 className="text-white font-semibold mb-4">
            We deliver to:
          </h3>

          <div className="flex flex-wrap gap-6 text-sm">
            {[
              "Bangalore",
              "Hyderabad",
              "Mumbai",
              "Delhi",
              "Chennai",
              "Pune",
              "Kolkata",
              "Ahmedabad",
              "Jaipur",
              "Indore"
            ].map((city, index) => (
              <span
                key={index}
                className="hover:text-white cursor-pointer"
              >
                {city}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
