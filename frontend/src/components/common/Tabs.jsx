import React from "react";
import { motion } from "framer-motion";

const Tabs = ({ tabs, activeTab, onChange, className = "" }) => {
  return (
    <div className={`flex flex-wrap gap-2 p-1 bg-gray-100/50 rounded-2xl border border-gray-100 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative px-6 py-2.5 text-sm font-bold transition-all duration-300 rounded-xl flex items-center gap-2 ${
              isActive ? "text-indigo-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-white shadow-sm border border-gray-100 rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">
              {tab.icon && (React.isValidElement(tab.icon) ? tab.icon : <tab.icon size={16} />)}
            </span>
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
