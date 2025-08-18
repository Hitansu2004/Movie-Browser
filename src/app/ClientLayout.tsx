"use client";

import Header from "@/components/Header";
import { Footer } from "@/components/Footer";
import LoadingBar from "@/components/LoadingBar";
import ScrollToTop from "@/components/ScrollToTop";
import QuickActions from "@/components/QuickActions";
import { ToastProvider } from "@/components/Toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect, useState } from "react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    // Add a small delay to ensure all components are ready
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Simplified loading state without complex animations
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">Loading Cinemate</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Preparing your movie experience...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
        <LoadingBar />
        <Header />
        <main className="flex-1 relative">
          {children}
        </main>
        <Footer />
        <ScrollToTop />
        <QuickActions />
      </div>
    </ToastProvider>
  );
}
