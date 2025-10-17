import { cva, VariantProps } from 'class-variance-authority';

export const loaderVariants = cva('', {
  variants: {
    zSize: {
      default: 'size-md',
      md: 'size-md',
      sm: 'size-sm',
      lg: 'size-lg',
    },
  },
  defaultVariants: {
    zSize: 'default',
  },
});
export type ZardLoaderVariants = VariantProps<typeof loaderVariants>;
