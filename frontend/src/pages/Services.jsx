import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
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
    result = result.filter((s) => s.price >= min && s.price <= max);
    if (selectedSort === "price_asc") result.sort((a, b) => a.price - b.price);
    else if (selectedSort === "price_desc")
      result.sort((a, b) => b.price - a.price);
    else if (selectedSort === "rating")
      result.sort((a, b) => b.rating - a.rating);

    setFiltered(result);
  }, [search, selectedCategory, selectedSort, priceRange, services]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setSelectedSort("");
    setPriceRange(0);
  };
  const hasFilters =
    search || selectedCategory !== "All" || selectedSort || priceRange !== 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="bg-slate-900 pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -ml-64 -mb-64" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
          >
            Available <span className="text-indigo-400">Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto"
          >
            Find and book the best home service professionals for your needs in {userCity || "your city"}
          </motion.p>

          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-2 rounded-[2rem] shadow-2xl flex items-center group focus-within:ring-4 focus-within:ring-indigo-500/20 transition-all">
              <div className="pl-6 pr-4">
                <Search size={22} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Ex. Salon, Plumbing, Deep cleaning..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 bg-transparent py-4 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
              />
              {search && (
                <button onClick={() => setSearch("")} className="p-2 text-slate-400 hover:text-slate-900 mr-2">
                  <X size={20} />
                </button>
              )}
              <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-[1.5rem] font-black transition-all active:scale-95 shadow-xl shadow-indigo-600/20">
                Find Now
              </button>
            </div>
            
            {userCity && (
              <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-sm font-bold">
                <MapPin size={16} className="text-indigo-400" />
                Showing services in <span className="text-white px-2 py-0.5 bg-slate-800 rounded-lg">{userCity}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 -mt-12 relative z-20 pb-24">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-24">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal size={20} className="text-indigo-600" /> Filters
                </h3>
                {hasFilters && (
                  <button 
                    onClick={clearFilters}
                    className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors uppercase tracking-wider"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Category */}
              <div className="space-y-4 mb-10">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Service Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3 py-3 rounded-2xl text-xs font-bold transition-all border-2 ${
                        selectedCategory === cat 
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100" 
                          : "bg-white border-slate-50 text-slate-500 hover:border-slate-100 hover:bg-slate-50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div className="space-y-4 mb-10">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Sort Results</label>
                <div className="relative group">
                  <ArrowUpDown size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" />
                  <select
                    value={selectedSort}
                    onChange={(e) => setSelectedSort(e.target.value)}
                    className="w-full pl-10 pr-10 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 appearance-none cursor-pointer transition-all"
                  >
                    {sortOptions.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Price Filter */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Price Range</label>
                <div className="space-y-2">
                  {priceRanges.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => setPriceRange(i)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                        priceRange === i 
                          ? "bg-slate-900 text-white" 
                          : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                      }`}
                    >
                      {r.label}
                      {priceRange === i && <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="mb-8 flex items-center justify-between px-6">
              <h2 className="text-xl font-black text-slate-900">
                {isLoading ? "Fetching catalog..." : filtered.length === 0 ? "No results found" : `${filtered.length} Experts Found`}
              </h2>
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
                    <div key={i} className="bg-white rounded-[2.5rem] h-96 animate-pulse border border-slate-100" />
                  ))}
                </motion.div>
              ) : filtered.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200"
                >
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Filter size={40} className="text-slate-200" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Well, this is empty!</h3>
                  <p className="text-slate-400 font-bold mb-8">Try clearing some filters or searching for something else.</p>
                  <button 
                    onClick={clearFilters}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-black hover:bg-slate-900 hover:shadow-xl transition-all active:scale-95"
                  >
                    Reset All Filters
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
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
