import React from "react";
import { Search, CalendarCheck, Coffee, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const steps = [
    {
      icon: Search,
      title: "Select Service",
      desc: "Choose from 50+ specialized home services.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: CalendarCheck,
      title: "Book Expert",
      desc: "Pick a professional in your 2-hour slot.",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      icon: Coffee,
      title: "Relax & Enjoy",
      desc: "Our expert handles the rest. Satisfaction guaranteed.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <section className="py-32 px-6 bg-slate-50 dark:bg-slate-950/50 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 rounded-full border border-indigo-100 dark:border-indigo-900/50"
          >
            The Journey
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight"
          >
            Simple as <span className="text-indigo-600 dark:text-indigo-400">1-2-3</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector Line (Desktop) */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-100 dark:bg-slate-800 -translate-y-1/2 hidden md:block z-0" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative z-10 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-24 h-24 rounded-[2.5rem] ${step.bg} flex items-center justify-center mb-10 border-4 border-white dark:border-slate-900 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                  <step.icon size={36} className={step.color} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">
                  {step.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[200px]">
                  {step.desc}
                </p>
                
                {idx < steps.length - 1 && (
                  <div className="mt-8 md:hidden">
                    <ChevronRight className="text-slate-200 dark:text-slate-800 rotate-90" size={24} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Floating Background Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[60%] bg-indigo-50/20 dark:bg-indigo-900/5 blur-[120px] pointer-events-none -z-10" />
      </div>
    </section>
  );
};

export default HowItWorks;
