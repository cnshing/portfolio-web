import { cva, VariantProps } from 'class-variance-authority';

const dateVariants = cva('text-inherit', {
  variants: {
    zSize: {
      sm: 'text-md',
      default: 'text-lg',
      lg: 'text-xl',
    }
  },
  defaultVariants: {
    zSize: 'default'
  },
});

export { dateVariants };
export type ZardDateVariants = VariantProps<typeof dateVariants>;
