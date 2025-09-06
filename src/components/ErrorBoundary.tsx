'use client';

import { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import Link from 'next/link';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Show toast notification only on client side
    if (typeof window !== 'undefined') {
      try {
        toast.error('Something went wrong', 'Please refresh the page or try again later');
      } catch (e) {
        console.error('Failed to show toast:', e);
      }
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Oops! Something went wrong
            </h2>
            
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Don't worry, our team has been notified.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
                <h3 className="font-semibold text-sm text-gray-700 mb-2">Error Details:</h3>
                <p className="text-xs text-gray-600 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleReload} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </Button>
              
              <Link href="/">
                <Button variant="outline" className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Component for handling async errors
interface AsyncErrorBoundaryProps {
  children: ReactNode;
  onError?: (error: Error) => void;
}

export function AsyncErrorBoundary({ children, onError }: AsyncErrorBoundaryProps) {
  const handleError = (error: Error) => {
    console.error('Async error:', error);
    if (typeof window !== 'undefined') {
      try {
        toast.error('Operation failed', 'Please try again');
      } catch (e) {
        console.error('Failed to show toast:', e);
      }
    }
    onError?.(error);
  };

  return (
    <ErrorBoundary fallback={
      <div className="p-4 text-center">
        <p className="text-gray-600">Unable to load content. Please try again.</p>
      </div>
    }>
      {children}
    </ErrorBoundary>
  );
}