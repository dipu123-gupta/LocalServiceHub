import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import axios from "axios";
import { MapPin, ChevronDown, Check, Loader2, Navigation, Globe, Search, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LocationSelector = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState(
    localStorage.getItem("userCity") || "Select City",
  );
  const [detecting, setDetecting] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCities = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/cities");
        setCities(data);
      } catch (err) {
        console.error("Failed to fetch cities", err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && cities.length === 0) {
      fetchCities();
    }
  }, [isOpen, cities.length]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (cityName, lat = null, lng = null) => {
    setSelectedCity(cityName);
    localStorage.setItem("userCity", cityName);
    if (lat && lng) {
      localStorage.setItem("userLat", lat);
      localStorage.setItem("userLng", lng);
    } else {
      localStorage.removeItem("userLat");
      localStorage.removeItem("userLng");
    }
    setIsOpen(false);
    window.dispatchEvent(new Event("cityChange"));
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
          );
          const detectedCity =
            res.data.address.city ||
            res.data.address.town ||
            res.data.address.village;

          if (detectedCity) {
            const cityExists = cities.some(
              (c) => c.name.toLowerCase() === detectedCity.toLowerCase(),
            );
            if (cityExists) {
              handleCitySelect(
                cities.find(
                  (c) => c.name.toLowerCase() === detectedCity.toLowerCase(),
                ).name,
                latitude,
                longitude,
              );
            } else {
              handleCitySelect(detectedCity, latitude, longitude);
              alert(
                `Detected location: ${detectedCity}. Note: Some services might be limited here.`,
              );
            }
          } else {
            alert("Could not accurately determine your city.");
          }
        } catch (error) {
          console.error("Error detecting location: ", error);
          alert("Failed to get location from coordinates.");
        } finally {
          setDetecting(false);
        }
      },
      (error) => {
        console.error("Geolocation error: ", error);
        alert("Permission denied or location unavailable.");
        setDetecting(false);
      },
    );
  };

  return (
    <div className="relative z-[1000]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white border border-slate-100 px-5 py-3 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-100 transition-all group active:scale-95"
      >
        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          <MapPin size={16} />
        </div>
        <div className="text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Your location</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-900">{selectedCity}</span>
            <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 mt-4 w-72 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-50">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Location Settings</h4>
                <Globe size={14} className="text-indigo-200" />
              </div>
              <button
                onClick={detectLocation}
                disabled={detecting}
                className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all active:scale-95 disabled:opacity-50 group"
              >
                {detecting ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Navigation size={16} className="group-hover:rotate-12 transition-transform" />
                    Detect Current
                  </>
                )}
              </button>
            </div>

            <div className="p-2">
              <div className="max-h-[300px] overflow-y-auto custom-scrollbar px-2 py-2 space-y-1">
                <div className="px-3 py-2 text-[10px] font-black text-slate-300 uppercase tracking-widest">Available Cities</div>
                {loading ? (
                  <div className="flex justify-center items-center py-10">
                    <Loader2 size={24} className="animate-spin text-indigo-200" />
                  </div>
                ) : cities.length === 0 ? (
                  <div className="px-3 py-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No cities found</div>
                ) : (
                  cities.map((city) => (
                    <button
                      key={city._id}
                      onClick={() => handleCitySelect(city.name)}
                      className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-bold flex items-center justify-between transition-all ${
                        selectedCity === city.name 
                          ? "bg-indigo-50 text-indigo-600 shadow-inner" 
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      {city.name}
                      {selectedCity === city.name && (
                        <CheckCircle2 size={16} className="text-indigo-600" />
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center">
                <Search size={14} className="text-slate-400" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 leading-tight">Can't find your city? We're expanding fast!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LocationSelector;
