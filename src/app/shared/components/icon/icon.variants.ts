import { cva, VariantProps } from 'class-variance-authority';

export const iconVariants = cva('flex items-center justify-center', {
  variants: {
    zSize: {
      sm: 'text-md',
      default: 'text-lg',
      lg: 'text-2xl',
      xl: 'text-3xl',
    },
    zColor: {
      default: 'text-on-bg-button',
      outline: 'text-border-button',
      ghost: 'text-on-bg-secondary',
      secondary: 'text-secondary-foreground',
      destructive: 'text-color-default'
    }
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardIconVariants = VariantProps<typeof iconVariants>;
