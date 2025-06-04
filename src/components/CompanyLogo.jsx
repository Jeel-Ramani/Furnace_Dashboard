import React from "react";
import { motion } from "framer-motion";

const CompanyLogo = () => {
  return (
    <motion.div
      className="flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1, type: "spring", stiffness: 120 }}
    >
      <div className="p-2 sm:p-3 bg-card rounded-full shadow-lg border border-primary/30">
        <img
          src='/logo.png'
          alt="Company Logo"
          className="h-20 w-20 sm:h-24 sm:w-24 md:h-22 md:w-22 object-contain"
        />
      </div>
    </motion.div>
  );
};

export default CompanyLogo;