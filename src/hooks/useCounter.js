import { useState, useEffect } from 'react';

// Custom hook to animate numeric counter values
export function useCounter(endValue, duration = 2000, startOnMount = true) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startOnMount) return;

    // Extract raw numeric value from strings like "15,000+" or "14+"
    let numericEnd = typeof endValue === 'number' ? endValue : parseInt(String(endValue).replace(/[^0-9]/g, ''), 10);
    if (isNaN(numericEnd)) numericEnd = 0;

    let startTimestamp = null;
    let animationFrame;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * numericEnd));

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      }
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [endValue, duration, startOnMount]);

  return count;
}
