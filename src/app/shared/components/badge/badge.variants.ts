import { cva, VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center border text- px-xs py-3xs font-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      zType: {
        default: 'border-transparent bg-color-button text-on-bg-button hover:bg-color-button/85',
        secondary: 'border-transparent bg-color-surface2 text-color-secondary hover:bg-color-surface2/70',
        destructive: 'border-transparent bg-destructive text-color-default hover:bg-destructive/85',
        outline: 'border-color-subtle border text-on-bg-secondary hover:bg-color-surface1/70'
      },
      zShape: {
        default: 'rounded-full',
        square: 'rounded-xs',
      },
    },
    defaultVariants: {
      zType: 'default',
      zShape: 'square',
    },
  },
);
export type ZardBadgeVariants = VariantProps<typeof badgeVariants>;
