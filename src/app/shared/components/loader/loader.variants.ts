import { cva, VariantProps } from 'class-variance-authority';

export const loaderVariants = cva('', {
  variants: {
    zSize: {
      default: 'size-sm',
      sm: 'size-xs',
      md: 'size-sm',
      lg: 'size-md',
      xl: 'size-lg',
      '2xl': 'size-xl',
      '3xl': 'size-2xl',
      icon: 'size-md', // Should be the same as lg variant
      full: 'size-full'
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});
export type ZardLoaderVariants = VariantProps<typeof loaderVariants>;
