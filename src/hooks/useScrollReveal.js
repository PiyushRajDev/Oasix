import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook to detect when an element enters the viewport using Intersection Observer.
 * Resilient against headless browser runs and immediate viewport rendering.
 * 
 * @param {Object} options - IntersectionObserver options
 * @param {number} options.threshold - Trigger threshold (0.0 to 1.0)
 * @param {string} options.rootMargin - Margin around the root bounding box
 * @param {boolean} options.once - If true, triggers only once and unobserves
 * @returns {[React.RefObject, boolean]} [ref, isVisible]
 */
export const useScrollReveal = ({
  threshold = 0.05,
  rootMargin = '120px 0px 0px 0px',
  once = true
} = {}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) {
      setIsVisible(true);
      return;
    }

    // Check if IntersectionObserver is supported
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      requestAnimationFrame(() => setIsVisible(true));
      return;
    }

    // Check if element is already in viewport on mount
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
      requestAnimationFrame(() => setIsVisible(true));
      if (once) return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(el);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [threshold, rootMargin, once]);

  return [elementRef, isVisible];
};
