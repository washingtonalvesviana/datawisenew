import React, { InputHTMLAttributes, forwardRef } from 'react';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'outline' | 'filled' | 'flushed';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = '',
      fullWidth = true,
      size = 'md',
      variant = 'outline',
      type = 'text',
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    // Tamanhos
    const sizeStyles = {
      sm: 'h-8 text-sm px-2',
      md: 'h-10 text-base px-3',
      lg: 'h-12 text-lg px-4',
    };

    // Variantes
    const variantStyles = {
      outline: 'border border-gray-300 bg-white focus:border-primary-500',
      filled: 'border border-transparent bg-gray-100 focus:bg-white',
      flushed: 'border-b border-gray-300 rounded-none px-0 bg-transparent',
    };

    // Classes base para o contêiner
    const containerClass = fullWidth ? 'w-full' : '';

    // Classes para o input
    const inputBaseClass = 'w-full rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50';
    const inputErrorClass = error ? 'border-error-500 focus:border-error-500 focus:ring-error-500' : '';
    const inputDisabledClass = disabled ? 'opacity-60 cursor-not-allowed bg-gray-100' : '';
    const inputWithIconsPadding = leftIcon ? 'pl-10' : '';

    return (
      <div className={`${containerClass}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-500">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            type={type}
            disabled={disabled}
            required={required}
            className={`${inputBaseClass} ${sizeStyles[size]} ${variantStyles[variant]} ${inputErrorClass} ${inputDisabledClass} ${inputWithIconsPadding} ${className}`}
            {...props}
          />

          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>

        {error && <p className="mt-1 text-sm text-error-500">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';