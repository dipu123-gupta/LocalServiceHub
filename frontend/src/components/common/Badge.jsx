import React from "react";

const Badge = ({ children, variant = "pending", className = "" }) => {
  const variants = {
    pending: "bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-900/50",
    accepted: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50",
    "on-the-way": "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50",
    started: "bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-700",
    confirmed: "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50",
    completed: "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50",
    cancelled: "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50",
    info: "bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/50",
    gray: "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-slate-700",
  };

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${variants[variant] || variants.gray} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
