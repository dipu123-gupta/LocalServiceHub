import { Link } from "react-router-dom";
import { ChevronRight, Loader2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import ServiceCard from "../ServiceCard";
import Button from "../common/Button";

const TopServicesSection = ({ isLoading, topServices }) => {
  return (
    <section className="py-24 px-6 bg-slate-50 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 rounded-full">
              <Sparkles size={12} /> Popular Choices
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Top Rated Services
            </h2>
            <p className="text-slate-500 mt-4 text-lg font-medium max-w-xl">
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
              <Button variant="outline" size="sm" icon={ChevronRight} className="font-black uppercase tracking-widest text-[10px] px-8 border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white hover:border-slate-900 h-14 rounded-2xl transition-all">
                View All Catalog
              </Button>
            </Link>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Loader2 className="w-12 h-12 text-indigo-200 animate-spin" />
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
            className="text-center py-20 px-6 bg-white rounded-[3rem] border border-slate-100 shadow-sm"
          >
            <div className="text-6xl mb-8">🏘️</div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">No services found nearby</h3>
            <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">
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
