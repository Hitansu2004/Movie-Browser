"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const LoadingBar = () => {
  const [isLoading, setIsLoading] = useState(false);
  const controls = useAnimation();
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    controls.start({
      width: "100%",
      transition: { duration: 0.8, ease: "easeInOut" }
    });

    const timer = setTimeout(() => {
      setIsLoading(false);
      controls.start({
        opacity: 0,
        transition: { duration: 0.3 }
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname, controls]);

  if (!isLoading) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
      initial={{ width: "0%", opacity: 1 }}
      animate={controls}
      style={{ transformOrigin: "left" }}
    />
  );
};

export default LoadingBar;
