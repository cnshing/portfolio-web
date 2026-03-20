import { cva, VariantProps } from 'class-variance-authority';

export const badgeVariants = cva(
  'inline-flex items-center border px-sm py-3xs font-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-center',
  {
    variants: {
      zType: {
        default: 'border-transparent bg-color-button text-on-bg-button hover:bg-color-button/default',
        secondary: 'border-transparent bg-color-surface2 text-color-tertiary hover:bg-color-surface2/default',
        destructive: 'border-transparent bg-destructive text-color-default hover:bg-destructive/strong',
        outline: 'border-color-subtle border bg-color-surface1 text-color-secondary hover:bg-color-surface1/default'
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
