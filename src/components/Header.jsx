import React from "react";
import { RxCaretDown } from "react-icons/rx";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { CiDiscount1 } from "react-icons/ci";
import { IoIosHelpBuoy } from "react-icons/io";
import { IoPersonCircle } from "react-icons/io5";
import {
  MdHome,
  MdWork,
  MdMyLocation,
  MdLocationOn,
  MdClose
} from "react-icons/md";

export default function Header() {
  const [toggle, setToggle] = React.useState(false);
  const [address, setAddress] = React.useState("Select location");
  const [tempAddress, setTempAddress] = React.useState("");
  const [recent, setRecent] = React.useState([]);
  const [searchResults, setSearchResults] = React.useState([]);

  const searchTimeout = React.useRef(null);

  const showSideMenu = () => setToggle(true);
  const hideSideMenu = () => setToggle(false);

  /* =====================
     FORMAT HEADER ADDRESS
     ===================== */
  const formatHeaderAddress = (full) => {
    if (!full || full === "Select location") {
      return { title: "Select location", subtitle: "" };
    }
    const parts = full.split(",").map(p => p.trim());
    return {
      title: parts[0],
      subtitle: parts.slice(1).join(", ")
    };
  };

  /* =====================
     LOAD RECENT LOCATIONS
     ===================== */
  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentLocations")) || [];
    setRecent(saved);
  }, []);

  /* =====================
     SAVE / REMOVE RECENT
     ===================== */
  const saveLocation = (loc) => {
    const updated = [loc, ...recent.filter(l => l !== loc)].slice(0, 5);
    setRecent(updated);
    localStorage.setItem("recentLocations", JSON.stringify(updated));
  };

  const removeRecent = (loc) => {
    const updated = recent.filter(l => l !== loc);
    setRecent(updated);
    localStorage.setItem("recentLocations", JSON.stringify(updated));
  };

  /* =====================
     CURRENT LOCATION (GPS)
     ===================== */
  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}`
          );
          const data = await res.json();
          if (data.display_name) {
            setTempAddress(data.display_name);
          }
        } catch {
          alert("Unable to fetch address");
        }
      },
      () => alert("Location permission denied")
    );
  };

  /* =====================
     CONFIRM LOCATION
     ===================== */
  const confirmLocation = () => {
    if (!tempAddress) return;
    setAddress(tempAddress);
    saveLocation(tempAddress);
    setSearchResults([]);
    hideSideMenu();
  };

  /* =====================
     SEARCH LOCATION FETCH
     ===================== */
  const handleSearch = (value) => {
    setTempAddress(value);

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      if (!value) {
        setSearchResults([]);
        return;
      }

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            value
          )}&addressdetails=1&limit=5`
        );
        const data = await res.json();
        setSearchResults(data);
      } catch {
        setSearchResults([]);
      }
    }, 500);
  };

  const links = [
    { icon: <FaSearch />, name: "Search" },
    { icon: <CiDiscount1 />, name: "Offers", sup: "New" },
    { icon: <IoIosHelpBuoy />, name: "Help" },
    { icon: <IoPersonCircle />, name: "Sign In" },
    { icon: <FaShoppingCart />, name: "Cart", sup: "1" }
  ];

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={hideSideMenu}
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity
          ${toggle ? "opacity-100 visible" : "opacity-0 invisible"}`}
      />

      {/* SIDE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-[500px] bg-white z-50
          transform transition-transform duration-300
          ${toggle ? "translate-x-0" : "-translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 overflow-y-auto h-full">
          {/* SEARCH */}
          <div className="border rounded-lg flex items-center px-3 py-2 mb-2">
            <FaSearch className="text-gray-400 mr-2" />
            <input
              placeholder="Search for area, street name…"
              value={tempAddress}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full outline-none text-sm"
            />
          </div>

          {/* SEARCH RESULTS */}
          {searchResults.length > 0 && (
            <div className="border rounded-lg mb-4 bg-white shadow">
              {searchResults.map((item, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setTempAddress(item.display_name);
                    setSearchResults([]);
                  }}
                  className="p-3 cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                >
                  <div className="font-semibold text-sm">
                    {item.display_name.split(",")[0]}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.display_name}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* CURRENT LOCATION */}
          <button
            onClick={useCurrentLocation}
            className="flex items-center gap-2 text-[#fc8019] font-semibold mb-4"
          >
            <MdMyLocation /> Use current location
          </button>

          {/* MAP */}
          {tempAddress && (
            <div className="mb-4 rounded-lg overflow-hidden border">
              <iframe
                title="map"
                width="100%"
                height="200"
                loading="lazy"
                src={`https://www.openstreetmap.org/export/embed.html?search=${encodeURIComponent(
                  tempAddress
                )}`}
              />
            </div>
          )}

          {/* CONFIRM */}
          <button
            onClick={confirmLocation}
            disabled={!tempAddress}
            className={`w-full py-2 rounded-lg text-white font-semibold mb-6
              ${
                tempAddress
                  ? "bg-[#fc8019] hover:bg-[#e96f14]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
          >
            Use this location
          </button>

          {/* RECENT LOCATIONS */}
          {recent.length > 0 && (
            <>
              <h3 className="font-semibold text-lg mb-3">Recent Locations</h3>
              <div className="space-y-3 mb-6">
                {recent.map((loc, i) => (
                  <div
                    key={i}
                    className="flex justify-between hover:bg-gray-100 p-3 rounded-lg"
                  >
                    <div
                      onClick={() => setTempAddress(loc)}
                      className="flex gap-3 cursor-pointer"
                    >
                      <MdLocationOn className="text-xl text-gray-600" />
                      <span className="text-sm">{loc}</span>
                    </div>
                    <MdClose
                      onClick={() => removeRecent(loc)}
                      className="cursor-pointer text-gray-400 hover:text-red-500"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          {/* SAVED */}
          <h3 className="font-semibold text-lg mb-4">Saved Addresses</h3>
          <div className="space-y-4">
            <div
              onClick={() => setTempAddress("Kalaburgi, Karnataka 585101")}
              className="flex gap-3 cursor-pointer hover:bg-gray-100 p-3 rounded-lg"
            >
              <MdHome className="text-xl text-gray-600" />
              <div>
                <p className="font-semibold">Home</p>
                <p className="text-sm text-gray-500">
                  Kalaburgi, Karnataka 585101
                </p>
              </div>
            </div>

            <div
              onClick={() => setTempAddress("IT Park, Bangalore 560103")}
              className="flex gap-3 cursor-pointer hover:bg-gray-100 p-3 rounded-lg"
            >
              <MdWork className="text-xl text-gray-600" />
              <div>
                <p className="font-semibold">Work</p>
                <p className="text-sm text-gray-500">
                  IT Park, Bangalore 560103
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="p-[10px] shadow-xl text-[#686b78] relative z-10">
        <div className="max-w-[1200px] mx-auto flex items-center">
          <img src="/images/Logo.png" className="w-[80px]" alt="Logo" />

          <div
            className="ml-4 flex items-start gap-2 cursor-pointer"
            onClick={showSideMenu}
          >
            {(() => {
              const { title, subtitle } = formatHeaderAddress(address);
              return (
                <>
                  <div className="leading-tight max-w-[320px]">
                    <div className="font-bold border-b-2 border-black inline-block">
                      {title}
                    </div>
                    {subtitle && (
                      <div className="text-sm text-gray-500 leading-snug break-words">
                        {subtitle}
                      </div>
                    )}
                  </div>
                  <RxCaretDown
                    fontSize={22}
                    className="text-[#fc8019] mt-1"
                  />
                </>
              );
            })()}
          </div>

          <nav className="flex list-none gap-10 ml-auto font-semibold text-[18px]">
            {links.map((link, index) => (
              <li
                key={index}
                className="flex hover:text-[#fc8019] items-center gap-2 cursor-pointer"
              >
                {link.icon}
                {link.name}
                {link.sup && <sup>{link.sup}</sup>}
              </li>
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
