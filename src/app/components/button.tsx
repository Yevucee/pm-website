import { forwardRef } from 'react';
import { cn } from '@/app/components/ui/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-200',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent',
          // Variants
          variant === 'primary' && 'bg-accent text-black hover:bg-accent-hover active:scale-95',
          variant === 'secondary' && 'bg-surface text-foreground hover:bg-border',
          variant === 'ghost' && 'text-foreground hover:bg-surface',
          variant === 'outline' && 'border-2 border-accent text-accent hover:bg-accent hover:text-black',
          // Sizes
          size === 'sm' && 'h-9 px-4 text-sm rounded-md',
          size === 'md' && 'h-11 px-6 text-base rounded-lg',
          size === 'lg' && 'h-14 px-8 text-lg rounded-xl',
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
