import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const PageHeader = ({ title, breadcrumbs, description }) => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-900 text-white pb-16 pt-24 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-white opacity-5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-indigo-500 opacity-10 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Breadcrumbs */}
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-indigo-200 mb-6">
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <ChevronRight size={14} />
                  {crumb.link ? (
                    <Link
                      to={crumb.link}
                      className="hover:text-white transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white font-medium">
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            {title}
          </h1>

          {description && (
            <p className="text-xl text-indigo-100 max-w-2xl">{description}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PageHeader;
