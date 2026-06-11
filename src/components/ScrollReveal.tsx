import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  key?: React.Key;
}

export default function ScrollReveal({
  children,
  delay = 0,
  className = '',
  direction = 'up'
}: ScrollRevealProps) {
  const [elementRef, isVisible] = useIntersectionObserver({
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px',
    freezeOnceVisible: false // Ensure repetition when scrolling down and up
  });

  const getDirectionClass = () => {
    switch (direction) {
      case 'up': return 'translate-y-12';
      case 'down': return '-translate-y-12';
      case 'left': return 'translate-x-12';
      case 'right': return '-translate-x-12';
      default: return 'scale-95';
    }
  };

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-[950ms] ${
        isVisible 
          ? 'opacity-100 translate-y-0 translate-x-0 scale-100' 
          : `opacity-0 ${getDirectionClass()}`
      } ${className}`}
      style={{ 
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${delay}ms` 
      }}
    >
      {children}
    </div>
  );
}
