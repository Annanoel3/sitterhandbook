import React, { useEffect, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

const THRESHOLD = 72;

export default function PullToRefresh({ onRefresh, children }) {
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const el = document.scrollingElement || document.documentElement;

    const onTouchStart = (e) => {
      if (el.scrollTop === 0) {
        startY.current = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e) => {
      if (startY.current === null) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta > 0 && el.scrollTop === 0) {
        // Rubber-band effect — dampen
        setPullY(Math.min(delta * 0.45, THRESHOLD + 20));
      }
    };

    const onTouchEnd = async () => {
      if (pullY >= THRESHOLD && !refreshing) {
        setRefreshing(true);
        await onRefresh();
        setRefreshing(false);
      }
      setPullY(0);
      startY.current = null;
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [pullY, refreshing, onRefresh]);

  const progress = Math.min(pullY / THRESHOLD, 1);
  const triggered = pullY >= THRESHOLD;

  return (
    <div ref={containerRef} style={{ position: "relative" }}>
      {/* Indicator */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center pointer-events-none z-10 transition-opacity"
        style={{
          top: -48,
          transform: `translateY(${pullY}px)`,
          opacity: progress,
        }}
      >
        <div className={`w-10 h-10 rounded-full bg-card border border-border shadow-md flex items-center justify-center ${refreshing ? "animate-spin" : ""}`}>
          <RefreshCw
            className="w-5 h-5 text-accent"
            style={{ transform: `rotate(${progress * 180}deg)`, transition: refreshing ? "none" : "transform 0.05s" }}
          />
        </div>
      </div>

      {/* Content shifts down while pulling */}
      <div style={{ transform: `translateY(${pullY}px)`, transition: pullY === 0 ? "transform 0.3s ease" : "none" }}>
        {children}
      </div>
    </div>
  );
}