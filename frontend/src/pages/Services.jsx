import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "@/utils/api";
import ServiceCard from "../components/ServiceCard";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  Loader2,
  MapPin,
  Star,
  ArrowUpDown,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sortOptions = [
  { label: "Recommended", value: "" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Highest Rated", value: "rating" },
];

const priceRanges = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹2,500", min: 1000, max: 2500 },
  { label: "₹2,500+", min: 2500, max: Infinity },
];

const Services = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get("category") || "All";

  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedSort, setSelectedSort] = useState("");
  const [priceRange, setPriceRange] = useState(0);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [userCity, setUserCity] = useState(
    localStorage.getItem("userCity") || "",
  );

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(["All", ...data.map(c => c.name)]);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    const handleCityChange = () => {
      setUserCity(localStorage.getItem("userCity") || "");
    };
    window.addEventListener("cityChange", handleCityChange);
    return () => window.removeEventListener("cityChange", handleCityChange);
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        const uCity = localStorage.getItem("userCity");
        const uLat = localStorage.getItem("userLat");
        const uLng = localStorage.getItem("userLng");

        let params = [];
        if (uCity && uCity !== "Select City")
          params.push(`city=${encodeURIComponent(uCity)}`);
        if (uLat && uLng) {
          params.push(`lat=${uLat}&lng=${uLng}`);
        }
        const qs = params.length > 0 ? `?${params.join("&")}` : "";

        const { data } = await api.get(`/services${qs}`);
        setServices(data);
        setFiltered(data);
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchServices();
  }, [userCity]);

  useEffect(() => {
    let result = [...services];
    const { min, max } = priceRanges[priceRange];

    if (search)
      result = result.filter(
        (s) =>
          s.title?.toLowerCase().includes(search.toLowerCase()) ||
          s.description?.toLowerCase().includes(search.toLowerCase()),
      );
    if (selectedCategory !== "All")
      result = result.filter((s) => s.category?.name === selectedCategory);
    
    // Price Filter
    result = result.filter((s) => s.price >= min && s.price <= max);

    // Rating Filter
    if (minRating > 0) {
      result = result.filter((s) => (s.rating || 0) >= minRating);
    }

    if (selectedSort === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (selectedSort === "price_desc")
      result.sort((a, b) => b.price - a.price);
    else if (selectedSort === "rating")
      result.sort((a, b) => b.rating - a.rating);

    setFiltered(result);
  }, [search, selectedCategory, selectedSort, priceRange, minRating, services]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedSort("");
    setPriceRange(0);
    setMinRating(0);
  };

  const hasFilters =
    search || selectedCategory !== "All" || selectedSort || priceRange !== 0 || minRating !== 0;

  const removeFilter = (type) => {
    if (type === "search") setSearch("");
    if (type === "category") setSelectedCategory("All");
    if (type === "price") setPriceRange(0);
    if (type === "rating") setMinRating(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Hero Header */}
      <div className="bg-slate-900 dark:bg-slate-950 pt-24 sm:pt-32 pb-20 sm:pb-24 px-4 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-indigo-500/10 rounded-full blur-[80px] sm:blur-[120px] -mr-32 -mt-32 sm:-mr-64 sm:-mt-64" />
          <div className="absolute bottom-0 left-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-purple-500/10 rounded-full blur-[80px] sm:blur-[120px] -ml-32 -mb-32 sm:-ml-64 sm:-mb-64" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-4xl md:text-6xl font-black text-white mb-4 sm:mb-6 tracking-tight leading-tight"
          >
            Available <span className="text-indigo-400">Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-base sm:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto px-4"
          >
            Find and book the best home service professionals for your needs in {userCity || "your city"}
          </motion.p>

          <div className="max-w-3xl mx-auto px-2">
            <div className="bg-white dark:bg-slate-900 p-1.5 sm:p-2 rounded-2xl sm:rounded-[2rem] shadow-2xl dark:shadow-indigo-500/10 flex flex-col sm:flex-row items-center group focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all gap-2">
              <div className="flex items-center w-full px-4 py-2 sm:py-0">
                <Search size={20} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Ex. Salon, Plumbing..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 bg-transparent py-2 sm:py-4 px-3 text-slate-900 dark:text-white font-semibold focus:outline-none placeholder:text-slate-400 text-sm sm:text-base"
                />
                {search && (
                  <button onClick={() => setSearch("")} className="p-2 text-slate-400 hover:text-slate-900">
                    <X size={18} />
                  </button>
                )}
              </div>
              <button className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-[1.5rem] font-black transition-all active:scale-95 shadow-xl shadow-indigo-600/20 text-xs sm:text-sm uppercase tracking-widest sm:tracking-normal">
                Find Now
              </button>
            </div>
            
            {userCity && (
              <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-[10px] sm:text-sm font-bold">
                <MapPin size={14} className="text-indigo-400" />
                Showing in <span className="text-white px-2 py-0.5 bg-slate-800 rounded-lg">{userCity}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 -mt-8 sm:-mt-12 relative z-20 pb-20">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-6 sticky top-24 z-30">
          <button 
            onClick={() => setShowFilters(true)}
            className="w-full bg-white dark:bg-slate-900 py-4 rounded-2xl shadow-xl flex items-center justify-center gap-3 border border-slate-100 dark:border-slate-800 text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest"
          >
            <Filter size={18} className="text-indigo-600" /> Filter & Sort
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Backdrop for Mobile */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] lg:hidden"
              />
            )}
          </AnimatePresence>

          {/* Sidebar / Mobile Drawer */}
          <aside className={`
            fixed lg:static inset-x-0 bottom-0 z-[101] lg:z-auto lg:w-80 shrink-0 
            transition-transform duration-500 lg:translate-y-0
            ${showFilters ? "translate-y-0" : "translate-y-full lg:translate-y-0"}
          `}>
            <div className="bg-white dark:bg-slate-900 rounded-t-[2.5rem] lg:rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl transition-colors duration-300 flex flex-col max-h-[90vh] lg:max-h-none lg:sticky lg:top-24">
              <div className="p-6 sm:p-8 border-b border-slate-50 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/20 shrink-0">
                <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-indigo-600" /> Filters
                </h3>
                <div className="flex items-center gap-4">
                  {hasFilters && (
                    <button 
                      onClick={clearFilters}
                      className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest"
                    >
                      Clear
                    </button>
                  )}
                  <button onClick={() => setShowFilters(false)} className="lg:hidden p-2 text-slate-400">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-8 sm:space-y-10 overflow-y-auto custom-scrollbar">
                {/* Category Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categories</label>
                    <ChevronDown size={14} className="text-slate-300" />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                          selectedCategory === cat 
                            ? "bg-indigo-600 border-indigo-600 text-white shadow-lg" 
                            : "bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 hover:bg-slate-100 dark:text-slate-400"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price Range</label>
                    <ChevronDown size={14} className="text-slate-300" />
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                    {priceRanges.map((r, i) => (
                      <label 
                        key={i}
                        className={`flex items-center gap-3 cursor-pointer group p-3 rounded-2xl border transition-all ${
                          priceRange === i ? "bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/50" : "border-transparent hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <input
                          type="radio"
                          name="price"
                          checked={priceRange === i}
                          onChange={() => setPriceRange(i)}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                          priceRange === i ? "border-indigo-600 bg-indigo-600" : "border-slate-200 dark:border-slate-700 group-hover:border-indigo-400"
                        }`}>
                          {priceRange === i && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span className={`text-[11px] sm:text-xs font-bold ${priceRange === i ? "text-indigo-700 dark:text-indigo-400" : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400"}`}>
                          {r.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Rating</label>
                    <ChevronDown size={14} className="text-slate-300" />
                  </div>
                  <div className="flex lg:flex-col flex-wrap gap-2">
                    {[4, 3, 2].map((r) => (
                      <label 
                        key={r}
                        className={`flex items-center gap-2 cursor-pointer group px-4 py-2 lg:p-0 rounded-xl lg:bg-transparent ${minRating === r ? "bg-amber-50 dark:bg-amber-900/10" : ""}`}
                      >
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === r}
                          onChange={() => setMinRating(r)}
                          className="hidden"
                        />
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0 ${
                          minRating === r ? "border-amber-500 bg-amber-500" : "border-slate-200 dark:border-slate-700 group-hover:border-amber-400"
                        }`}>
                          {minRating === r && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <span className={`text-[11px] sm:text-xs font-bold flex items-center gap-1.5 ${minRating === r ? "text-amber-700 dark:text-amber-400" : "text-slate-500 group-hover:text-slate-700 dark:text-slate-400"}`}>
                          {r}★ <span className="hidden lg:inline">& above</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Mobile Apply Button */}
                <button 
                  onClick={() => setShowFilters(false)}
                  className="w-full lg:hidden bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            {/* Applied Filters Bar */}
            <div className="mb-6 flex flex-wrap items-center gap-3">
              {hasFilters && <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Applied:</span>}
              {search && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-black border border-indigo-100 dark:border-indigo-900/50">
                  Search: {search}
                  <button onClick={() => removeFilter("search")}><X size={12} /></button>
                </div>
              )}
              {selectedCategory !== "All" && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg text-[10px] font-black border border-blue-100 dark:border-blue-900/50">
                  Category: {selectedCategory}
                  <button onClick={() => removeFilter("category")}><X size={12} /></button>
                </div>
              )}
              {priceRange !== 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black border border-emerald-100 dark:border-emerald-900/50">
                  {priceRanges[priceRange].label}
                  <button onClick={() => removeFilter("price")}><X size={12} /></button>
                </div>
              )}
              {minRating !== 0 && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-lg text-[10px] font-black border border-amber-100 dark:border-amber-900/50">
                  Rating: {minRating}★+
                  <button onClick={() => removeFilter("rating")}><X size={12} /></button>
                </div>
              )}
            </div>

            <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  {isLoading ? "Fetching experts..." : `${filtered.length} Experts Handpicked`}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Found in {userCity || "nearby locations"}</p>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative group flex-1 sm:min-w-[200px]">
                  <ArrowUpDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 appearance-none cursor-pointer shadow-sm transition-all"
                  >
                    {sortOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 rounded-[2.5rem] h-96 animate-pulse border border-slate-100 dark:border-slate-800" />
                  ))}
                </motion.div>
              ) : filtered.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white dark:bg-slate-900 rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 transition-colors duration-300"
                >
                  <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Filter size={40} className="text-slate-200 dark:text-slate-700" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Well, this is empty!</h3>
                  <p className="text-slate-400 dark:text-slate-500 font-bold mb-8">Try clearing some filters or searching for something else.</p>
                  <button 
                    onClick={clearFilters}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-slate-900 dark:hover:bg-indigo-500 hover:shadow-xl transition-all active:scale-95"
                  >
                    Reset All Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8"
                >
                  {filtered.map((service, idx) => (
                    <motion.div
                      key={service._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <ServiceCard service={service} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default Services;
