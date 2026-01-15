import { cva, VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
"cursor-pointer inline-flex items-center justify-center min-h-fit gap-xs whitespace-nowrap rounded-xs text-lg font-medium transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50   focus-visible:ring-[0.46875rem] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive font-button",
  {
    variants: {
      zType: {
        default: 'bg-color-button text-on-bg-button shadow-xs hover:bg-color-button/default focus-visible:ring-border-button/55',
      destructive: 'bg-destructive text-color-default shadow-xs hover:bg-destructive/strong focus-visible:ring-destructive/28',
        outline: 'border-color-button border shadow-xs bg-color-page text-border-button hover:bg-color-surface1/default focus-visible:ring-border-button/60',
        secondary: 'bg-color-surface2 border-color-subtle border text-secondary-foreground shadow-xs hover:bg-color-surface2/strong',
        ghost: 'text-on-bg-secondary bg-none hover:bg-color-surface2 hover:text-color-secondary',
        link: 'text-on-bg-default underline-offset-4 hover:underline',
      },
      zSize: {
        default: 'h-xl px-md py-md has-[>svg]:px-sm',
        sm: 'h-lg px-sm py-sm has-[>svg]:px-xs',
        lg: 'h-2xl px-lg py-md has-[>svg]:px-md',
        icon: 'size-xl',
      },
      zShape: {
        default: 'rounded-md',
        circle: 'rounded-full',
        square: 'rounded-none',
      },
      zFull: {
        true: 'w-full',
      },
      zLoading: {
        true: 'opacity-50 pointer-events-none',
      },
    },
    defaultVariants: {
      zType: 'default',
      zSize: 'default',
      zShape: 'default',
    },
  },
);
export type ZardButtonVariants = VariantProps<typeof buttonVariants>;
