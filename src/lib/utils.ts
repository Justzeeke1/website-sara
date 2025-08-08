import { clsx, type ClassValue } from "clsx"
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Prefer scrolling the app's internal scroll container
    const container = document.getElementById('app-scroll-container');
    if (container) {
      // Ensure instant and exact top without leaving gaps
      container.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      (container as HTMLElement).scrollTop = 0; // Fallback
    } else {
      // Final fallback to window
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};