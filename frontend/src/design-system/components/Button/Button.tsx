import React, { ButtonHTMLAttributes } from 'react';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = ({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) => {
  // Variantes de botão
  const variantStyles = {
    primary: `bg-primary-500 hover:bg-primary-600 text-white border border-transparent`,
    secondary: `bg-gray-100 hover:bg-gray-200 text-gray-800 border border-transparent`,
    outline: `bg-transparent hover:bg-gray-100 text-gray-800 border border-gray-300`,
    ghost: `bg-transparent hover:bg-gray-100 text-gray-600 border border-transparent`,
    danger: `bg-error-500 hover:bg-error-600 text-white border border-transparent`,
  };

  // Tamanhos do botão
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  // Classes base
  const baseStyle = 'font-medium rounded-md flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50';
  
  // Classes para width
  const widthClass = fullWidth ? 'w-full' : '';
  
  // Classes para estados disabled e loading
  const stateClass = (disabled || isLoading)
    ? 'opacity-60 cursor-not-allowed pointer-events-none'
    : '';
  
  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${widthClass} ${stateClass} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {leftIcon && !isLoading && (
        <span className="mr-2">{leftIcon}</span>
      )}
      
      {children}
      
      {rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
};