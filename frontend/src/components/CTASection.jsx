import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

const CTASection = ({
  title = "Ready to transform your home?",
  description = "Join thousands of satisfied customers who have experienced our top-rated home services.",
  primaryButtonText = "Book a Service",
  primaryButtonLink = "/categories",
  secondaryButtonText = "Learn More",
  secondaryButtonLink = "/about",
  withBackground = false,
}) => {
  return (
    <section className={`py-24 ${withBackground ? "bg-white dark:bg-slate-950" : ""} transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-[2rem] overflow-hidden bg-indigo-600 dark:bg-indigo-700"
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500 dark:bg-indigo-600 opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-700 dark:bg-indigo-800 opacity-50 blur-3xl"></div>

          <div className="relative z-10 px-6 py-16 md:py-20 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-sm font-medium mb-6">
                <Sparkles size={16} />
                <span>Experience Excellence</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {title}
              </h2>
              <p className="text-xl text-indigo-100">{description}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
              <Link
                to={primaryButtonLink}
                className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-white dark:bg-slate-900 dark:text-white text-indigo-600 font-bold text-lg hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
              >
                {primaryButtonText}
                <ArrowRight size={20} />
              </Link>
              {secondaryButtonText && (
                <Link
                  to={secondaryButtonLink}
                  className="inline-flex justify-center items-center gap-2 px-8 py-4 rounded-xl bg-indigo-700/50 dark:bg-indigo-900/50 border border-indigo-500 dark:border-indigo-700 text-white font-bold text-lg hover:bg-indigo-700 dark:hover:bg-indigo-800 transition-all w-full sm:w-auto"
                >
                  {secondaryButtonText}
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
