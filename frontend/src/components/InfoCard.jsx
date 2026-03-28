import React from "react";
import { motion } from "framer-motion";

const InfoCard = ({ icon: Icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-white dark:bg-slate-900 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md dark:shadow-none hover:shadow-indigo-500/10 transition-all group h-full flex flex-col"
    >
      <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 dark:group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 transition-colors">{title}</h3>
      <p className="text-gray-600 dark:text-slate-400 leading-relaxed flex-grow transition-colors">{description}</p>
    </motion.div>
  );
};

export default InfoCard;
