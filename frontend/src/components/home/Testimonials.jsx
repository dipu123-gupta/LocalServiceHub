import React, { useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Priyanka Sharma",
    service: "Deep House Cleaning",
    rating: 5,
    text: "The professional was extremely thorough and polite. My home has never looked this clean! Highly recommend the deep cleaning service.",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "Amit Patel",
    service: "AC Repair & Service",
    rating: 5,
    text: "Saved me from the peak summer heat. The technician arrived on time and fixed the gas leak within an hour. Excellent experience.",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Sonia Verma",
    service: "Salon for Women",
    rating: 5,
    text: "Amazing salon experience at home! The professional brought all her own equipment and was very hygienic. Five stars for sure.",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
  },
  {
    name: "Rajesh Kumar",
    service: "Full Home Painting",
    rating: 5,
    text: "HomeServiceHub made my renovation so easy. The painting crew was meticulous and finished ahead of schedule. Truly professional.",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
  },
];

const Testimonials = () => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-20 px-6 bg-[#0A0C10] relative overflow-hidden">
      {/* Background Meshes */}
       <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
       <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-950/40 rounded-full border border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.1)]">
              <Star size={12} className="text-amber-400" /> Community Voice
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Loved by <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Happy Customers</span>
            </h2>
          </motion.div>

          <div className="flex gap-4">
            <button 
              onClick={() => scroll("left")}
              className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all active:scale-95 text-white"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll("right")}
              className="w-14 h-14 bg-indigo-600 border border-indigo-500 rounded-2xl flex items-center justify-center hover:bg-indigo-500 transition-all active:scale-95 text-white shadow-lg shadow-indigo-600/20"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto pb-12 no-scrollbar snap-x"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="min-w-[280px] sm:min-w-[320px] md:min-w-[450px] p-6 md:p-10 bg-white/5 border border-white/10 rounded-[2.5rem] md:rounded-[3rem] backdrop-blur-3xl snap-center relative group"
            >
              <Quote className="absolute top-6 right-6 md:top-8 md:right-8 text-indigo-500/20 w-10 h-10 md:w-16 md:h-16 group-hover:scale-110 transition-transform duration-500" />
              
              <div className="flex items-center gap-2 mb-8">
                {[...Array(item.rating)].map((_, i) => (
                  <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-xl md:text-2xl font-medium text-slate-200 leading-relaxed mb-10 italic">
                "{item.text}"
              </p>

              <div className="flex items-center gap-5 pt-10 border-t border-white/5">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 overflow-hidden border-2 border-indigo-500/30">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white uppercase tracking-tight">{item.name}</h4>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">{item.service}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
