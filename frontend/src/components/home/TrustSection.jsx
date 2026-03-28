import React from "react";
import { ShieldCheck, Zap, Lock, Headphones, Award, Heart } from "lucide-react";
import { motion } from "framer-motion";

const TrustSection = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "Verified Pros",
      desc: "Every professional undergoes a 3-step background and skill verification process.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      icon: Award,
      title: "Service Warranty",
      desc: "Get 30 days of post-service troubleshooting and protection at no extra cost.",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: Zap,
      title: "Rapid Support",
      desc: "Our dedicated support team is available 24/7 to handle your queries and bookings.",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      desc: "Transact with confidence using our encrypted and industry-standard payment gateway.",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
  ];

  return (
    <section className="py-32 px-6 bg-white dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      {/* Decorative Accents */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 rounded-full border border-emerald-100 dark:border-emerald-900/50">
              <ShieldCheck size={12} /> Uncompromising Safety
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-tight mb-8">
              Why 50,000+ <br />
              <span className="text-indigo-600 dark:text-indigo-400">Users Trust Us</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed mb-10 max-w-lg">
              We've built a world-class ecosystem focused on quality, transparency, and 
              your peace of mind. Every service is a commitment to excellence.
            </p>
            
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800" />
                ))}
                <div className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 bg-indigo-600 flex items-center justify-center text-[10px] font-black text-white">
                  +1k
                </div>
              </div>
              <div className="text-left">
                <span className="block text-xl font-black text-slate-900 dark:text-white">Rated 4.8/5</span>
                <span className="block text-[10px] font-black uppercase tracking-widest text-slate-400">By our happy community</span>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/40 group hover:-translate-y-2 hover:border-indigo-600/30"
              >
                <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                  <feature.icon size={24} className={feature.color} />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-3 uppercase tracking-tight leading-tight">
                  {feature.title}
                </h3>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
