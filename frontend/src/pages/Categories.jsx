import React from "react";
import api from "@/utils/api";
import { Link } from "react-router-dom";
import { 
  ChevronRight, 
  Search, 
  Grid, 
  Sparkles,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

const colorMap = {
  Cleaning: { color: "bg-blue-50", textColor: "text-blue-700", border: "hover:border-blue-500", icon: "🧹" },
  Plumbing: { color: "bg-orange-50", textColor: "text-orange-700", border: "hover:border-orange-500", icon: "🔧" },
  Electrical: { color: "bg-yellow-50", textColor: "text-yellow-700", border: "hover:border-yellow-500", icon: "⚡" },
  Painting: { color: "bg-pink-50", textColor: "text-pink-700", border: "hover:border-pink-500", icon: "🎨" },
  Carpentry: { color: "bg-amber-50", textColor: "text-amber-700", border: "hover:border-amber-500", icon: "🪚" },
  "AC Repair": { color: "bg-cyan-50", textColor: "text-cyan-700", border: "hover:border-cyan-500", icon: "❄️" },
  "Pest Control": { color: "bg-green-50", textColor: "text-green-700", border: "hover:border-green-500", icon: "🌿" },
  Salon: { color: "bg-purple-50", textColor: "text-purple-700", border: "hover:border-purple-500", icon: "✂️" },
};

const Categories = () => {
  const [categories, setCategories] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        const formatted = data.map(c => ({
          ...c,
          ...colorMap[c.name] || { color: "bg-slate-50", textColor: "text-slate-700", border: "hover:border-indigo-500", icon: c.icon || "🛠️" },
          desc: c.description
        }));
        setCategories(formatted);
      } catch (err) {
        console.error("Failed to load categories", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Hero Section */}
      <div className="bg-slate-900 pt-32 pb-40 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -mr-64 -mt-64" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -ml-64 -mb-64" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-indigo-300 font-bold text-sm mb-12"
          >
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} />
            <span className="text-white">All Categories</span>
          </motion.div>

          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600/20 border border-indigo-600/30 text-indigo-300 rounded-full text-[10px] font-black uppercase tracking-widest mb-6"
            >
              <Grid size={12} /> Service Catalog
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight"
            >
              Explore Our <span className="text-indigo-400">Services</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-slate-400 text-lg md:text-xl font-semibold leading-relaxed"
            >
              From minor repairs to major home transformations, find the right professional for every task.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <main className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        {isLoading ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-white rounded-[2.5rem] animate-pulse border border-slate-100" />
              ))}
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
            >
              <Link
                to={`/services?category=${cat.name}`}
                className="group flex flex-col h-full bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden relative"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${cat.color} opacity-0 group-hover:opacity-100 rounded-full -mr-16 -mt-16 blur-2xl transition-opacity duration-700`} />
                
                <div className="relative z-10">
                  <div className={`w-16 h-16 rounded-2xl ${cat.color} ${cat.textColor} flex items-center justify-center text-3xl mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}>
                    {cat.icon}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-black text-slate-900 leading-none">{cat.name}</h3>
                    {idx < 3 && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-600 text-[9px] font-black uppercase rounded-lg border border-amber-100">
                        <TrendingUp size={10} /> Popular
                      </div>
                    )}
                  </div>
                  
                  <p className="text-slate-500 font-bold text-sm mb-8 leading-relaxed">
                    {cat.desc}
                  </p>
                  
                  <div className="mt-auto flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Browse services <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        )}

        {/* Support Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 p-12 bg-white rounded-[3.5rem] border border-slate-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-slate-50 opacity-50" />
          <div className="relative z-10 max-w-xl text-center md:text-left">
            <div className="mb-4 inline-flex items-center justify-center p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100">
              <Sparkles size={24} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-4">Can't find what you're looking for?</h2>
            <p className="text-slate-500 font-bold leading-relaxed">
              Our experts are constantly expanding. Tell us what you need and we'll help you find the right pro or notify you when they're available.
            </p>
          </div>
          <div className="relative z-10 flex gap-4">
            <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all active:scale-95">
              Contact Support
            </button>
            <Link to="/services" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-100">
              View All Services
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Categories;
