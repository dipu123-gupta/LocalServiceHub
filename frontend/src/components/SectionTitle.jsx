import React from "react";
import { motion } from "framer-motion";

const SectionTitle = ({ title, subtitle, align = "center" }) => {
  const alignmentClass =
    {
      left: "text-left",
      center: "text-center mx-auto",
      right: "text-right ml-auto",
    }[align] || "text-center mx-auto";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-12 max-w-3xl ${alignmentClass}`}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
        {title}
      </h2>
      {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
    </motion.div>
  );
};

export default SectionTitle;
