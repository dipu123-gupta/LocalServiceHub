import { motion } from "framer-motion";

const stats = [
  { value: "50,000+", label: "Happy Customers", color: "text-indigo-500" },
  { value: "2,000+", label: "Verified Experts", color: "text-blue-500" },
  { value: "30+", label: "Service Categories", color: "text-emerald-500" },
  { value: "4.8★", label: "Average Rating", color: "text-amber-500" },
];

const StatsSection = () => {
  return (
    <section className="relative z-20 px-6">
      <div className="max-w-6xl mx-auto -mt-12">
        <div className="grid grid-cols-2 md:grid-cols-4 bg-white dark:bg-slate-800/90 dark:backdrop-blur-xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-none rounded-[2rem] p-3 border border-slate-100 dark:border-slate-700 transition-colors duration-300">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative p-6 sm:p-8 text-center group ${
                i < stats.length - 1 ? "md:after:content-[''] md:after:absolute md:after:right-0 md:after:top-1/2 md:after:-translate-y-1/2 md:after:h-12 md:after:w-[1px] md:after:bg-slate-100 dark:md:after:bg-slate-700" : ""
              }`}
            >
              <div className={`text-3xl md:text-4xl font-black tracking-tight mb-2 ${s.color} transition-transform group-hover:scale-110 duration-500`}>
                {s.value}
              </div>
              <div className="text-[10px] md:text-xs text-slate-400 font-black uppercase tracking-[0.2em]">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
