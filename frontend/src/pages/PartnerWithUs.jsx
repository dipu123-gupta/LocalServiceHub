import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const PartnerWithUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-[60vh]">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-indigo-600 transition-colors">
          Home
        </Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">Partner With Us</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Partner With Us
        </h1>
        <p className="text-gray-600 text-lg mb-8">
          Discover our B2B and enterprise partnership opportunities.
        </p>
        <div className="bg-indigo-50/50 rounded-xl p-8 border border-indigo-100/50 text-center">
          <p className="text-gray-500">
            This page is currently under development. Content will be added
            soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PartnerWithUs;
