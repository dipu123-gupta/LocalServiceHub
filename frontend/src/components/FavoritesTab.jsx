import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Heart, Star, Clock, MapPin, Loader2, ArrowRight, Sparkles, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./common/Button";

const FavoritesTab = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get("/users/favorites");
      setFavorites(data);
    } catch (err) {
      console.error("Error fetching favorites", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center py-32 bg-white/50 backdrop-blur-sm rounded-[3rem] border border-dashed border-slate-200">
        <Loader2 className="w-12 h-12 text-indigo-400 animate-spin" />
      </div>
    );

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-3 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-full">
            <Bookmark size={12} /> Saved for Later
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            My Favorites <span className="text-indigo-600">({favorites.length})</span>
          </h2>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 px-6 bg-white rounded-[3rem] border border-slate-100 shadow-sm"
          >
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Heart size={40} className="text-slate-200" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">
              Your hearth is empty
            </h3>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">
              You haven't saved any services yet. Start exploring and save the ones you love!
            </p>
            <Button
              onClick={() => navigate("/services")}
              variant="primary"
              className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px]"
              icon={ArrowRight}
            >
              Explore Services
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {favorites.map((service, i) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={service.images?.[0] || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=400"}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-6 right-6">
                    <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg shadow-red-500/20 text-red-500 group-hover:scale-110 active:scale-90 transition-all">
                      <Heart size={20} fill="currentColor" />
                    </button>
                  </div>
                  <div className="absolute bottom-6 left-6">
                    <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                      {service.category?.name}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {service.title}
                  </h3>
                  
                  <div className="flex items-center gap-6 mb-8 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2">
                       <div className="p-2 rounded-lg bg-amber-50 text-amber-500">
                          <Star size={14} fill="currentColor" />
                       </div>
                       <span className="text-sm font-black text-slate-900">{service.rating?.toFixed(1) || "4.8"}</span>
                       <span className="text-xs text-slate-400 font-bold uppercase">(128)</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <div className="p-2 rounded-lg bg-slate-50 text-slate-400">
                          <Clock size={14} />
                       </div>
                       <span className="text-sm font-black text-slate-900">{service.duration} min</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 pt-6 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Starting from</span>
                      <span className="text-2xl font-black text-slate-900">₹{service.price}</span>
                    </div>
                    <button
                      onClick={() => navigate(`/services/${service._id}`)}
                      className="inline-flex items-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
                    >
                      Book Now
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FavoritesTab;
