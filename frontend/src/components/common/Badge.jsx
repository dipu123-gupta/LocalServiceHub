import React from "react";

const Badge = ({ children, variant = "pending", className = "" }) => {
  const variants = {
    pending: "bg-orange-50 text-orange-700 border-orange-200",
    accepted: "bg-indigo-50 text-indigo-700 border-indigo-200",
    "on-the-way": "bg-blue-50 text-blue-700 border-blue-200",
    started: "bg-indigo-600 text-white border-indigo-700",
    confirmed: "bg-green-50 text-green-700 border-green-200",
    completed: "bg-green-50 text-green-700 border-green-200",
    cancelled: "bg-red-50 text-red-700 border-red-200",
    info: "bg-indigo-50 text-indigo-700 border-indigo-200",
    gray: "bg-gray-100 text-gray-600 border-gray-200",
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
