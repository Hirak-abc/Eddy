import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg' | 'xl';
  variant?: 'primary' | 'muted' | 'white';
}

export function Spinner({
  className,
  size = 'default',
  variant = 'primary',
  ...props
}: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    default: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
    xl: 'h-12 w-12 border-4',
  };

  const variantClasses = {
    primary: 'border-primary/20 border-t-primary',
    muted: 'border-muted-foreground/20 border-t-muted-foreground',
    white: 'border-white/20 border-t-white',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export function PageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm font-medium text-muted-foreground">{text}</p>
    </div>
  );
}

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('animate-pulse rounded-md bg-muted', className)}
      {...props}
    />
  );
}
