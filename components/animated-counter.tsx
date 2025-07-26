"use client";

import React, { useEffect, useState, useRef } from "react";
import { useInView } from "react-intersection-observer";
import type { AnimatedCounterProps } from "@/types";

export default function AnimatedCounter({
  end,
  duration = 2000,
  className = "",
  prefix = "",
  decimals = 0,
  suffix = ""
}: AnimatedCounterProps): JSX.Element {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  useEffect(() => {
    if (inView) {
      // Reset count when coming into view
      countRef.current = 0;
      setCount(0);
      
      let startTime: number | null = null;
      let animationFrameId: number;
      
      // Easing function for smoother animation
      const easeOutQuad = (t: number) => t * (2 - t);
      
      const animateCount = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = easeOutQuad(progress);
        
        // Calculate the current count based on progress
        countRef.current = easedProgress * end;
        setCount(countRef.current);
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animateCount);
        } else {
          // Ensure we end exactly at the target number
          setCount(end);
        }
      };
      
      animationFrameId = requestAnimationFrame(animateCount);
      
      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [inView, end, duration]);
  
  // Format the number with commas and decimals
  const formattedCount = () => {
    const value = Math.floor(count);
    let formatted = value.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    
    return `${prefix}${formatted}${suffix}`;
  };
  
  return (
    <span ref={ref} className={className}>
      {formattedCount()}
    </span>
  );
} 