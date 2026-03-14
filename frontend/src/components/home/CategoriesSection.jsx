import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  { name: "Cleaning", icon: "🧹", color: "bg-blue-50", textColor: "text-blue-700", border: "border-blue-100" },
  { name: "Plumbing", icon: "🔧", color: "bg-orange-50", textColor: "text-orange-700", border: "border-orange-100" },
  { name: "Electrical", icon: "⚡", color: "bg-yellow-50", textColor: "text-yellow-700", border: "border-yellow-100" },
  { name: "Painting", icon: "🎨", color: "bg-pink-50", textColor: "text-pink-700", border: "border-pink-100" },
  { name: "Carpentry", icon: "🪚", color: "bg-amber-50", textColor: "text-amber-700", border: "border-amber-100" },
  { name: "AC Repair", icon: "❄️", color: "bg-cyan-50", textColor: "text-cyan-700", border: "border-cyan-100" },
  { name: "Pest Control", icon: "🌿", color: "bg-green-50", textColor: "text-green-700", border: "border-green-100" },
  { name: "Salon", icon: "✂️", color: "bg-purple-50", textColor: "text-purple-700", border: "border-purple-100" },
];

const CategoriesSection = () => {
  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight"
          >
            What are you looking for?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 mt-4 text-lg font-medium"
          >
            Explore our curated selection of 30+ specialized service categories
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link
                to={`/services?category=${cat.name}`}
                className="group block"
              >
                <div
                  className={`flex flex-col items-center p-7 rounded-[2rem] bg-white border border-slate-100 transition-all duration-500 shadow-sm group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] group-hover:-translate-y-2 group-hover:border-indigo-100`}
                >
                  <div
                    className={`w-16 h-16 rounded-[1.5rem] ${cat.color} flex items-center justify-center text-3xl mb-5 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-inner`}
                  >
                    {cat.icon}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
