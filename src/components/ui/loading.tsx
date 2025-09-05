'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'default' | 'dots' | 'pulse';
}

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  variant = 'default' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  if (variant === 'dots') {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-current rounded-full animate-bounce",
              sizeClasses[size],
              i === 0 && "delay-0",
              i === 1 && "delay-75",
              i === 2 && "delay-150"
            )}
            style={{
              animationDuration: '1.4s',
              animationIterationCount: 'infinite'
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        <div className={cn(
          "absolute inset-0 bg-current rounded-full opacity-75",
          "animate-ping"
        )} />
        <div className={cn(
          "relative bg-current rounded-full",
          sizeClasses[size]
        )} />
      </div>
    );
  }

  return (
    <div className={cn("animate-spin", sizeClasses[size], className)}>
      <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
}

interface LoadingProps {
  text?: string;
  subtext?: string;
  className?: string;
  spinnerProps?: LoadingSpinnerProps;
}

export function Loading({ 
  text = 'Loading...', 
  subtext, 
  className,
  spinnerProps 
}: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <LoadingSpinner {...spinnerProps} />
      {text && (
        <div className="text-center">
          <p className="text-gray-900 font-medium">{text}</p>
          {subtext && (
            <p className="text-gray-500 text-sm mt-1">{subtext}</p>
          )}
        </div>
      )}
    </div>
  );
}

interface PageLoadingProps {
  message?: string;
}

export function PageLoading({ message = 'Loading page...' }: PageLoadingProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loading 
        text={message}
        subtext="Please wait a moment"
        spinnerProps={{ size: 'xl', variant: 'default' }}
      />
    </div>
  );
}

interface ButtonLoadingProps {
  text?: string;
  className?: string;
}

export function ButtonLoading({ text = 'Loading...', className }: ButtonLoadingProps) {
  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <LoadingSpinner size="sm" />
      <span>{text}</span>
    </div>
  );
}