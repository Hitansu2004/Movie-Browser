"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Home, Star, TrendingUp, Calendar, Zap } from "lucide-react";
import Link from "next/link";

const QuickActions = () => {
  const [isOpen, setIsOpen] = useState(false);

  const actions = [
    { icon: Home, label: "Home", href: "/", color: "bg-blue-500" },
    { icon: Search, label: "Search", href: "/search", color: "bg-purple-500" },
    { icon: TrendingUp, label: "Popular", href: "/movies/popular", color: "bg-green-500" },
    { icon: Star, label: "Top Rated", href: "/movies/top", color: "bg-yellow-500" },
    { icon: Calendar, label: "Upcoming", href: "/movies/upcoming", color: "bg-pink-500" },
  ];

  return (
    <div className="fixed bottom-24 right-8 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.div
                key={action.href}
                initial={{ opacity: 0, x: 50, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 50, y: 20 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={action.href}
                  onClick={() => setIsOpen(false)}
                  className={`${action.color} hover:scale-110 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group relative`}
                >
                  <action.icon className="w-5 h-5" />
                  <span className="absolute right-full mr-3 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {action.label}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 ${
          isOpen ? "bg-red-500 hover:bg-red-600" : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        } text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center relative overflow-hidden`}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <Plus className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
        </motion.div>
        
        {!isOpen && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0"
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </motion.button>
    </div>
  );
};

export default QuickActions;
