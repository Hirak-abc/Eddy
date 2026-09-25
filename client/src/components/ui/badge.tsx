import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary: 'border-transparent bg-muted text-foreground hover:bg-muted/80',
        destructive: 'border-transparent bg-red-600 text-white shadow hover:bg-red-700',
        outline: 'border-border text-foreground',
        success: 'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
        warning: 'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
        // Domain-specific variants
        indigo: 'border-transparent bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400',
        emerald: 'border-transparent bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400',
        amber: 'border-transparent bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400',
        sky: 'border-transparent bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-400',
        rose: 'border-transparent bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
