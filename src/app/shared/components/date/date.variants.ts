import { cva, VariantProps } from 'class-variance-authority';

const dateVariants = cva('', {
  variants: {
    zSize: {
      sm: 'text-sm',
      default: 'text-sm',
      lg: 'text-lg',
    },
    zType: {
      default: 'text-color-default',
      outline: 'text-color-default',
      ghost: 'text-color-secondary',
    },
  },
  defaultVariants: {
    zSize: 'default',
    zType: 'outline',
  },
});

export { dateVariants };
export type ZardDateVariants = VariantProps<typeof dateVariants>;
