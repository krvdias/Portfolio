import React from "react";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

const LandingHeader: React.FC = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-10"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl bg-white/70 dark:bg-black/50 backdrop-blur-md shadow-lg border border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white">
          Portfolio.
        </h1>
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </motion.header>
  );
};

export default LandingHeader;