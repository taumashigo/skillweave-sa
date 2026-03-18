"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  label?: string;
  sublabel?: string;
  className?: string;
  animated?: boolean;
}

export function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  color = "#059669",
  bgColor = "#e2e8f0",
  label,
  sublabel,
  className,
  animated = true,
}: ProgressRingProps) {
  const [animatedValue, setAnimatedValue] = useState(animated ? 0 : value);

  useEffect(() => {
    if (!animated) {
      setAnimatedValue(value);
      return;
    }
    const timer = setTimeout(() => setAnimatedValue(value), 100);
    return () => clearTimeout(timer);
  }, [value, animated]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedValue / 100) * circumference;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="progress-ring-circle"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        {label ? (
          <>
            <span className="text-xl font-bold font-display text-slate-900">
              {label}
            </span>
            {sublabel && (
              <span className="text-xs text-slate-500">{sublabel}</span>
            )}
          </>
        ) : (
          <span className="text-lg font-bold font-display text-slate-900">
            {Math.round(animatedValue)}%
          </span>
        )}
      </div>
    </div>
  );
}
