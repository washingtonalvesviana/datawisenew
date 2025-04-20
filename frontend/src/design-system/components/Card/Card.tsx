import { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  bordered?: boolean;
  fullWidth?: boolean;
  clickable?: boolean;
}

export const Card = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  shadow = 'sm',
  radius = 'md',
  bordered = false,
  fullWidth = false,
  clickable = false,
  ...props
}: CardProps) => {
  // Variantes do card
  const variantStyles = {
    default: 'bg-white',
    outline: 'bg-white border border-gray-200',
    elevated: 'bg-white',
  };

  // Tamanhos de padding
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  // Tamanhos de sombra
  const shadowStyles = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow',
    lg: 'shadow-lg',
  };

  // Tamanhos de borda arredondada
  const radiusStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  // Classes para largura
  const widthClass = fullWidth ? 'w-full' : '';

  // Classes para interação
  const interactionClass = clickable
    ? 'cursor-pointer transition-shadow hover:shadow-md'
    : '';

  // Classes para borda
  const borderClass = bordered ? 'border border-gray-200' : '';

  return (
    <div
      className={`
        ${variantStyles[variant]} 
        ${paddingStyles[padding]} 
        ${shadowStyles[shadow]} 
        ${radiusStyles[radius]} 
        ${widthClass} 
        ${borderClass} 
        ${interactionClass} 
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`mb-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <h3 className={`text-lg font-semibold ${className}`} {...props}>
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <p className={`text-sm text-gray-500 ${className}`} {...props}>
      {children}
    </p>
  );
};

export const CardContent = ({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({
  children,
  className = '',
  ...props
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`mt-4 pt-3 border-t border-gray-100 ${className}`} {...props}>
      {children}
    </div>
  );
};