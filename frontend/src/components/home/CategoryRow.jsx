import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";
import ServiceCard from "../ServiceCard";

const CategoryRow = ({ category, services }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!services || services.length === 0) return null;

  return (
    <div className="py-12 border-b border-slate-100 dark:border-slate-800 last:border-0 transition-colors duration-300">
      <div className="flex items-center justify-between mb-8 px-2 md:px-0">
        <div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            {category.name}
          </h3>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
            Explore top rated {category.name} services
          </p>
        </div>
        <Link 
          to={`/services?category=${category._id}`}
          className="group flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-all"
        >
          See All
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="relative group">
        {/* Navigation Arrows */}
        <button 
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center -ml-6 opacity-0 group-hover:opacity-100 transition-all border border-slate-100 dark:border-slate-800 hidden md:flex"
        >
          <ChevronLeft size={20} className="text-slate-900 dark:text-white" />
        </button>
        <button 
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-xl flex items-center justify-center -mr-6 opacity-0 group-hover:opacity-100 transition-all border border-slate-100 dark:border-slate-800 hidden md:flex"
        >
          <ChevronRight size={20} className="text-slate-900 dark:text-white" />
        </button>

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {services.map((service, idx) => (
            <motion.div 
              key={service._id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="min-w-[280px] md:min-w-[320px] snap-start"
            >
              <ServiceCard service={service} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryRow;
