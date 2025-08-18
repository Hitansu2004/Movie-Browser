"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 7
}: PaginationProps) => {
  const [hoveredPage, setHoveredPage] = useState<number | null>(null);

  // Calculate visible page numbers
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    const pages = [];
    
    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('ellipsis-start');
      }
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('ellipsis-end');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const pageVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    hover: { 
      scale: 1.1, 
      backgroundColor: "#3b82f6",
      color: "#ffffff",
      transition: { duration: 0.2 }
    },
    active: {
      scale: 1.05,
      backgroundColor: "#2563eb",
      color: "#ffffff",
      boxShadow: "0 10px 25px rgba(37, 99, 235, 0.3)"
    }
  };

  const buttonVariants = {
    initial: { opacity: 0.6 },
    hover: { 
      opacity: 1, 
      scale: 1.05,
      backgroundColor: "#f3f4f6",
      transition: { duration: 0.2 }
    },
    disabled: { 
      opacity: 0.3, 
      cursor: "not-allowed" 
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center space-x-2 py-8"
    >
      {/* Previous Button */}
      <motion.button
        variants={buttonVariants}
        initial="initial"
        whileHover={currentPage > 1 ? "hover" : "disabled"}
        whileTap={{ scale: 0.95 }}
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`
          flex items-center px-3 py-2 rounded-lg border transition-all duration-200
          ${currentPage <= 1 
            ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }
        `}
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        <span className="hidden sm:inline">Previous</span>
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
  <AnimatePresence mode="sync">
          {visiblePages.map((page, index) => {
            if (typeof page === 'string') {
              return (
                <motion.div
                  key={page}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center w-10 h-10"
                >
                  <MoreHorizontal className="w-4 h-4 text-gray-400 dark:text-gray-600" />
                </motion.div>
              );
            }

            const isActive = page === currentPage;
            const isHovered = hoveredPage === page;

            return (
              <motion.button
                key={page}
                variants={pageVariants}
                initial="initial"
                animate={isActive ? "active" : "animate"}
                whileHover={!isActive ? "hover" : {}}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setHoveredPage(page)}
                onHoverEnd={() => setHoveredPage(null)}
                onClick={() => onPageChange(page)}
                className={`
                  relative flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all duration-200 overflow-hidden
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 border-2 border-blue-600' 
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
                  }
                `}
              >
                {/* Background gradient effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0"
                  animate={{
                    opacity: isHovered && !isActive ? 0.1 : 0
                  }}
                  transition={{ duration: 0.2 }}
                />
                
                {/* Page number */}
                <motion.span
                  animate={{
                    y: isActive ? [0, -2, 0] : 0
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: isActive ? Infinity : 0,
                    repeatDelay: 2
                  }}
                >
                  {page}
                </motion.span>

                {/* Active page indicator */}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-1/2 w-1 h-1 bg-white rounded-full"
                    initial={{ scale: 0, x: "-50%" }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Next Button */}
      <motion.button
        variants={buttonVariants}
        initial="initial"
        whileHover={currentPage < totalPages ? "hover" : "disabled"}
        whileTap={{ scale: 0.95 }}
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`
          flex items-center px-3 py-2 rounded-lg border transition-all duration-200
          ${currentPage >= totalPages 
            ? 'border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-600 cursor-not-allowed' 
            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }
        `}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4 ml-1" />
      </motion.button>

      {/* Page Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="hidden md:flex items-center ml-4 text-sm text-gray-600 dark:text-gray-400"
      >
        <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
          Page {currentPage} of {totalPages}
        </span>
      </motion.div>
    </motion.div>
  );
};

// Quick page jump component
export const PageJumper = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const [inputPage, setInputPage] = useState(currentPage.toString());
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    setInputPage(currentPage.toString());
  }, [currentPage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(inputPage);
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      setIsValid(true);
    } else {
      setIsValid(false);
      setTimeout(() => setIsValid(true), 2000);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-2 mt-4"
    >
      <label className="text-sm text-gray-600 dark:text-gray-400">
        Go to page:
      </label>
      <motion.input
        type="number"
        min="1"
        max={totalPages}
        value={inputPage}
        onChange={(e) => setInputPage(e.target.value)}
        className={`
          w-16 px-2 py-1 text-center border rounded transition-all duration-200
          ${isValid 
            ? 'border-gray-300 dark:border-gray-600' 
            : 'border-red-500 animate-pulse'
          }
          bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
          focus:outline-none focus:ring-2 focus:ring-blue-500
        `}
        animate={{
          borderColor: !isValid ? "#ef4444" : undefined
        }}
      />
      <motion.button
        type="submit"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors duration-200"
      >
        Go
      </motion.button>
    </motion.form>
  );
};
