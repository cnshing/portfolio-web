import { cva, VariantProps } from 'class-variance-authority';

export const iconVariants = cva('flex items-center justify-center', {
  variants: {
    zSize: {
      sm: "text-md",
      default: "text-lg",
      lg: "text-xl",
      xl: "text-2xl",
    },
    zColor: {
      default: 'text-inherit',
      outline: 'text-border-button',
      ghost: 'text-on-bg-secondary',
      secondary: 'text-color-secondary',
      destructive: 'text-color-default'
    }
  },
  defaultVariants: {
    zSize: 'default',
  },
});

export type ZardIconVariants = VariantProps<typeof iconVariants>;
