import { Shield, Star, Clock } from "lucide-react";
import { motion } from "framer-motion";

const FeatureBanner = () => {
  const features = [
    {
      icon: <Shield size={24} />,
      bg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      glow: "shadow-indigo-500/20",
      title: "Verified Professionals",
      desc: "All experts undergo strict background checks and skill tests.",
    },
    {
      icon: <Star size={24} />,
      bg: "bg-amber-50",
      iconColor: "text-amber-500",
      glow: "shadow-amber-500/20",
      title: "Quality Guaranteed",
      desc: "Not satisfied? We'll make it right, no questions asked.",
    },
    {
      icon: <Clock size={24} />,
      bg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      glow: "shadow-emerald-500/20",
      title: "Always On-Time",
      desc: "Our pros show up exactly when you need them, every time.",
    },
  ];

  return (
    <section className="bg-slate-50 py-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group bg-white rounded-[2.5rem] p-8 flex flex-col gap-6 items-start border border-slate-100 shadow-sm transition-all hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2"
            >
              <div className={`w-16 h-16 rounded-2xl ${f.bg} ${f.iconColor} flex items-center justify-center shrink-0 shadow-lg ${f.glow} group-hover:scale-110 transition-transform duration-500`}>
                {f.icon}
              </div>
              <div>
                <div className="text-xl font-black text-slate-900 mb-3 tracking-tight">
                  {f.title}
                </div>
                <p className="text-slate-500 leading-relaxed font-medium">
                  {f.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureBanner;
