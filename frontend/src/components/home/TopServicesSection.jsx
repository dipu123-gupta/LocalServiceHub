import { Link } from "react-router-dom";
import { ChevronRight, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ServiceCard from "../ServiceCard";
import Button from "../common/Button";

const TopServicesSection = ({ isLoading, topServices }) => {
  return (
    <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
              <Sparkles size={12} /> Popular Choices
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Top Rated Services
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg font-medium max-w-xl">
              Handpicked favorites and trending services loved by our growing community of happy homeowners.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link to="/services">
              <Button variant="outline" size="sm" icon={ChevronRight} className="font-black uppercase tracking-widest text-[10px] px-8 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-900 dark:hover:bg-indigo-600 hover:text-white hover:border-slate-900 dark:hover:border-indigo-600 h-14 rounded-2xl transition-all">
                View All Catalog
              </Button>
            </Link>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-32 bg-white dark:bg-slate-900 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <Loader2 className="w-12 h-12 text-indigo-200 dark:text-indigo-900 animate-spin" />
          </div>
        ) : topServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {topServices.map((service, i) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ServiceCard service={service} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center py-20 px-6 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300"
          >
            <div className="text-6xl mb-8">🏘️</div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">No services found nearby</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-10 max-w-sm mx-auto font-medium">
              We're rapidly expanding our network. Try exploring our full catalog for statewide availability.
            </p>
            <Link to="/services">
              <Button variant="primary" className="h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px]">Browse Full Catalog</Button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default TopServicesSection;
