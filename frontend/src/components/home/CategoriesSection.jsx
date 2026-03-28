import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoriesSection = ({ categories, isLoading }) => {
  // Fallback map for icons if not in DB
  const iconMap = {
    "Cleaning": "🧹",
    "Plumbing": "🔧",
    "Electrical": "⚡",
    "Painting": "🎨",
    "Carpentry": "🪚",
    "AC Repair": "❄️",
    "Pest Control": "🌿",
    "Salon": "✂️",
    "Installation Services": "💼",
    "Pet Services": "🐶",
    "Tech Services": "💻",
    "Event Services": "📸",
    "Vehicle Services": "🚗",
    "Education & Training": "📚",
    "Bathroom & Kitchen": "🚿",
    "Bedroom": "🛏️",
    "Commercial Services": "🏢",
    "Additional Cleaning": "🧹",
  };

  const getIcon = (name) => iconMap[name] || "🛠️";

  return (
    <section className="py-24 px-6 bg-white dark:bg-slate-900 overflow-hidden transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="text-center md:text-left">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase"
            >
              Choose a <span className="text-indigo-600 dark:text-indigo-400">Category</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
               transition={{ delay: 0.1 }}
              className="text-slate-500 dark:text-slate-400 mt-4 text-[10px] font-black uppercase tracking-[0.2em]"
            >
              Explore our professional specialized service categories
            </motion.p>
          </div>
          
          <Link 
            to="/services" 
            className="px-8 py-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white hover:bg-slate-900 dark:hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
          >
            All Categories
          </Link>
        </div>

        {/* Horizontal Scrolling Hub */}
        <div className="relative group/nav">
          {/* Navigation Arrows */}
          <button 
            onClick={() => {
              const el = document.getElementById("category-scroll");
              el.scrollBy({ left: -300, behavior: "smooth" });
            }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center -ml-6 opacity-0 group-hover/nav:opacity-100 transition-all border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 active:scale-90 hidden md:flex"
          >
            <ChevronLeft size={20} className="text-slate-900 dark:text-white" />
          </button>
          
          <button 
            onClick={() => {
              const el = document.getElementById("category-scroll");
              el.scrollBy({ left: 300, behavior: "smooth" });
            }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-2xl flex items-center justify-center -mr-6 opacity-0 group-hover/nav:opacity-100 transition-all border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 active:scale-90 hidden md:flex"
          >
            <ChevronRight size={20} className="text-slate-900 dark:text-white" />
          </button>

          <div 
            id="category-scroll"
            className="flex gap-6 overflow-x-auto pb-10 snap-x no-scrollbar mask-fade-right"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {isLoading ? (
               Array(8).fill(0).map((_, i) => (
                <div key={i} className="min-w-[160px] animate-pulse bg-slate-100 dark:bg-slate-800 h-44 rounded-[2.5rem]" />
              ))
            ) : (
              categories.map((cat, i) => (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="min-w-[140px] md:min-w-[180px] snap-center"
                >
                  <Link
                    to={`/services?category=${cat._id}`}
                    className="group block"
                  >
                    <div
                      className="flex flex-col items-center p-8 rounded-[2.5rem] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 transition-all duration-500 shadow-sm group-hover:shadow-[0_25px_50px_-12px_rgba(79,70,229,0.3)] dark:group-hover:shadow-indigo-900/60 group-hover:-translate-y-3 group-hover:border-indigo-600 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-950/20"
                    >
                      <div
                        className="w-16 h-16 rounded-[1.8rem] bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-inner border border-transparent group-hover:border-indigo-200 dark:group-hover:border-indigo-800"
                      >
                        {cat.icon || getIcon(cat.name)}
                      </div>
                      <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-center group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                        {cat.name}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
