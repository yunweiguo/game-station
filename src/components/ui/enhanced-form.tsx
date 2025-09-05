'use client';

import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { toast } from '@/components/ui/toast';
import { AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    custom?: (value: any) => string | null;
  };
}

interface EnhancedFormProps {
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => Promise<void>;
  submitText?: string;
  loadingText?: string;
  className?: string;
  initialValues?: Record<string, any>;
  showSuccessMessage?: boolean;
  successMessage?: string;
  resetOnSuccess?: boolean;
}

interface FormState {
  values: Record<string, any>;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isLoading: boolean;
  showPassword: Record<string, boolean>;
}

export function EnhancedForm({
  fields,
  onSubmit,
  submitText = 'Submit',
  loadingText = 'Submitting...',
  className,
  initialValues = {},
  showSuccessMessage = true,
  successMessage = 'Form submitted successfully!',
  resetOnSuccess = false
}: EnhancedFormProps) {
  const [formState, setFormState] = useState<FormState>({
    values: initialValues,
    errors: {},
    touched: {},
    isLoading: false,
    showPassword: {}
  });

  const formRef = useRef<HTMLFormElement>(null);

  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && (!value || value.toString().trim() === '')) {
      return `${field.label} is required`;
    }

    if (value && field.validation) {
      const { pattern, minLength, maxLength, min, max, custom } = field.validation;

      if (pattern && !pattern.test(value.toString())) {
        return `${field.label} format is invalid`;
      }

      if (minLength && value.toString().length < minLength) {
        return `${field.label} must be at least ${minLength} characters`;
      }

      if (maxLength && value.toString().length > maxLength) {
        return `${field.label} must be no more than ${maxLength} characters`;
      }

      if (min && parseFloat(value) < min) {
        return `${field.label} must be at least ${min}`;
      }

      if (max && parseFloat(value) > max) {
        return `${field.label} must be no more than ${max}`;
      }

      if (custom) {
        return custom(value);
      }
    }

    return null;
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    setFormState(prev => {
      const field = fields.find(f => f.name === fieldName);
      const error = field ? validateField(field, value) : null;
      
      return {
        ...prev,
        values: { ...prev.values, [fieldName]: value },
        errors: { ...prev.errors, [fieldName]: error },
        touched: { ...prev.touched, [fieldName]: true }
      };
    });
  };

  const handleFieldBlur = (fieldName: string) => {
    setFormState(prev => ({
      ...prev,
      touched: { ...prev.touched, [fieldName]: true }
    }));
  };

  const togglePasswordVisibility = (fieldName: string) => {
    setFormState(prev => ({
      ...prev,
      showPassword: {
        ...prev.showPassword,
        [fieldName]: !prev.showPassword[fieldName]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    fields.forEach(field => {
      const error = validateField(field, formState.values[field.name]);
      if (error) {
        newErrors[field.name] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setFormState(prev => ({
        ...prev,
        errors: newErrors,
        touched: Object.fromEntries(fields.map(f => [f.name, true]))
      }));
      toast.error('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true }));

    try {
      await onSubmit(formState.values);
      
      if (showSuccessMessage) {
        toast.success('Success!', successMessage);
      }

      if (resetOnSuccess) {
        setFormState({
          values: {},
          errors: {},
          touched: {},
          isLoading: false,
          showPassword: {}
        });
      } else {
        setFormState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Submission Failed', error instanceof Error ? error.message : 'An error occurred');
      setFormState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const renderField = (field: FormField) => {
    const value = formState.values[field.name] || '';
    const error = formState.errors[field.name];
    const touched = formState.touched[field.name];
    const showError = touched && error;

    const commonProps = {
      id: field.name,
      name: field.name,
      value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        handleFieldChange(field.name, e.target.value),
      onBlur: () => handleFieldBlur(field.name),
      className: cn(
        "w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
        "transition-all duration-200",
        showError ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300",
        field.type === 'checkbox' || field.type === 'radio' ? "mr-2" : ""
      )
    };

    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            placeholder={field.placeholder}
            rows={4}
            className={cn(commonProps.className, "resize-none")}
          />
        );

      case 'select':
        return (
          <select {...commonProps}>
            <option value="">{field.placeholder || `Select ${field.label}`}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              {...commonProps}
              type="checkbox"
              checked={value}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
            />
            <label htmlFor={field.name} className="text-sm text-gray-700">
              {field.label}
            </label>
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  {...commonProps}
                  type="radio"
                  value={option.value}
                  checked={value === option.value}
                  className={cn(commonProps.className, "text-indigo-600")}
                />
                <label htmlFor={field.name} className="text-sm text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        );

      case 'password':
        return (
          <div className="relative">
            <input
              {...commonProps}
              type={formState.showPassword[field.name] ? 'text' : 'password'}
              placeholder={field.placeholder}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility(field.name)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {formState.showPassword[field.name] ? 
                <EyeOff className="w-4 h-4" /> : 
                <Eye className="w-4 h-4" />
              }
            </button>
          </div>
        );

      default:
        return (
          <input
            {...commonProps}
            type={field.type}
            placeholder={field.placeholder}
          />
        );
    }
  };

  const isFormValid = fields.every(field => !validateField(field, formState.values[field.name]));

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={cn("space-y-6", className)}>
      {fields.map(field => (
        <div key={field.name} className="space-y-2">
          {field.type !== 'checkbox' && field.type !== 'radio' && (
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
          )}
          
          {renderField(field)}
          
          {showError && (
            <div className="flex items-center gap-1 text-sm text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          
          {field.validation?.maxLength && (
            <div className="text-xs text-gray-500">
              {value?.length || 0} / {field.validation.maxLength} characters
            </div>
          )}
        </div>
      ))}

      <div className="pt-4">
        <Button
          type="submit"
          disabled={!isFormValid || formState.isLoading}
          className="w-full flex items-center justify-center gap-2"
        >
          {formState.isLoading ? (
            <>
              <LoadingSpinner size="sm" />
              {loadingText}
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              {submitText}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// Loading spinner component for forms
function LoadingSpinner({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={cn("animate-spin", sizeClasses[size])}>
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