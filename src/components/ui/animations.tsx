'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export function FadeIn({ 
  children, 
  duration = 600, 
  delay = 0,
  direction = 'up',
  className 
}: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    
    switch (direction) {
      case 'up': return 'translate3d(0, 30px, 0)';
      case 'down': return 'translate3d(0, -30px, 0)';
      case 'left': return 'translate3d(30px, 0, 0)';
      case 'right': return 'translate3d(-30px, 0, 0)';
      default: return 'translate3d(0, 0, 0)';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface SlideInProps {
  children: React.ReactNode;
  direction: 'left' | 'right' | 'up' | 'down';
  duration?: number;
  delay?: number;
  className?: string;
}

export function SlideIn({ 
  children, 
  direction, 
  duration = 500, 
  delay = 0,
  className 
}: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    
    switch (direction) {
      case 'left': return 'translate3d(-100%, 0, 0)';
      case 'right': return 'translate3d(100%, 0, 0)';
      case 'up': return 'translate3d(0, -100%, 0)';
      case 'down': return 'translate3d(0, 100%, 0)';
    }
  };

  return (
    <div
      ref={ref}
      className={cn('overflow-hidden', className)}
      style={{
        transform: getTransform(),
        transition: `transform ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface ScaleInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  initialScale?: number;
  className?: string;
}

export function ScaleIn({ 
  children, 
  duration = 400, 
  delay = 0,
  initialScale = 0.8,
  className 
}: ScaleInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        transform: isVisible ? 'scale(1)' : `scale(${initialScale})`,
        opacity: isVisible ? 1 : 0,
        transition: `transform ${duration}ms ease-out ${delay}ms, opacity ${duration}ms ease-out ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface StaggeredListProps {
  children: React.ReactNode[];
  stagger?: number;
  duration?: number;
  className?: string;
}

export function StaggeredList({ 
  children, 
  stagger = 100, 
  duration = 400,
  className 
}: StaggeredListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children.map((child, index) => (
        <FadeIn
          key={index}
          delay={index * stagger}
          duration={duration}
        >
          {child}
        </FadeIn>
      ))}
    </div>
  );
}

interface PulseProps {
  children: React.ReactNode;
  duration?: number;
  intensity?: number;
  className?: string;
}

export function Pulse({ 
  children, 
  duration = 2000, 
  intensity = 1.05,
  className 
}: PulseProps) {
  return (
    <div
      className={cn('inline-block', className)}
      style={{
        animation: `pulse ${duration}ms ease-in-out infinite`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(${intensity}); }
        }
      `}</style>
    </div>
  );
}

interface BounceProps {
  children: React.ReactNode;
  duration?: number;
  height?: number;
  className?: string;
}

export function Bounce({ 
  children, 
  duration = 1000, 
  height = 20,
  className 
}: BounceProps) {
  return (
    <div
      className={cn('inline-block', className)}
      style={{
        animation: `bounce ${duration}ms ease-in-out infinite`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-${height}px); }
        }
      `}</style>
    </div>
  );
}

interface RotateProps {
  children: React.ReactNode;
  duration?: number;
  direction?: 'clockwise' | 'counterclockwise';
  className?: string;
}

export function Rotate({ 
  children, 
  duration = 2000, 
  direction = 'clockwise',
  className 
}: RotateProps) {
  const rotation = direction === 'clockwise' ? '360deg' : '-360deg';
  
  return (
    <div
      className={cn('inline-block', className)}
      style={{
        animation: `rotate ${duration}ms linear infinite`,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(${rotation}); }
        }
      `}</style>
    </div>
  );
}

// Hover effects
interface HoverScaleProps {
  children: React.ReactNode;
  scale?: number;
  duration?: number;
  className?: string;
}

export function HoverScale({ 
  children, 
  scale = 1.05, 
  duration = 300,
  className 
}: HoverScaleProps) {
  return (
    <div
      className={cn('transition-transform cursor-pointer', className)}
      style={{
        transition: `transform ${duration}ms ease-in-out`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `scale(${scale})`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      {children}
    </div>
  );
}

interface HoverLiftProps {
  children: React.ReactNode;
  lift?: number;
  duration?: number;
  shadow?: boolean;
  className?: string;
}

export function HoverLift({ 
  children, 
  lift = 10, 
  duration = 300,
  shadow = true,
  className 
}: HoverLiftProps) {
  return (
    <div
      className={cn('transition-all cursor-pointer', className)}
      style={{
        transition: `transform ${duration}ms ease-in-out${shadow ? ', box-shadow 300ms ease-in-out' : ''}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `translateY(-${lift}px)`;
        if (shadow) {
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        if (shadow) {
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {children}
    </div>
  );
}