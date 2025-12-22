import { ReactNode } from 'react';

interface PreviewContainerProps {
  children: ReactNode;
  variant?: 'default' | 'dark' | 'bordered';
  className?: string;
}

const variantStyles = {
  default: 'bg-gray-100 dark:bg-gray-900 rounded-lg',
  dark: 'bg-gray-900 rounded-lg',
  bordered: 'bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800',
};

export function PreviewContainer({ 
  children, 
  variant = 'default',
  className = '' 
}: PreviewContainerProps) {
  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}

interface PreviewLoadingProps {
  variant?: 'default' | 'dark' | 'bordered';
}

export function PreviewLoading({ variant = 'default' }: PreviewLoadingProps) {
  const textColor = variant === 'dark' ? 'text-gray-400' : 'text-gray-500';
  return (
    <PreviewContainer variant={variant} className="p-8 text-center">
      <p className={textColor}>Loading...</p>
    </PreviewContainer>
  );
}

interface PreviewErrorProps {
  message: string;
  variant?: 'default' | 'dark' | 'bordered';
}

export function PreviewError({ message, variant = 'default' }: PreviewErrorProps) {
  const textColor = variant === 'dark' ? 'text-red-400' : 'text-red-500';
  return (
    <PreviewContainer variant={variant} className="p-8 text-center">
      <p className={textColor}>{message}</p>
    </PreviewContainer>
  );
}
