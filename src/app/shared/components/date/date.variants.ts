import { cva, VariantProps } from 'class-variance-authority';

const dateVariants = cva('text-inherit', {
  variants: {
    zSize: {
      sm: 'text-sm',
      default: 'text-sm',
      lg: 'text-lg',
    }
  },
  defaultVariants: {
    zSize: 'default'
  },
});

export { dateVariants };
export type ZardDateVariants = VariantProps<typeof dateVariants>;
