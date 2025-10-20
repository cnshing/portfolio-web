import { cva, VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-xs whitespace-nowrap rounded-xs text-md font-medium transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      zType: {
        default: 'bg-color-button text-on-bg-button shadow-xs hover:bg-color-button/85',
        destructive: 'bg-destructive text-color-default shadow-xs hover:bg-destructive/85 focus-visible:ring-destructive/20',
        outline: 'border-color-button border shadow-xs bg-color-page text-border-button hover:bg-color-surface1/70',
        secondary: 'bg-color-surface1 border-color-subtle border text-secondary-foreground shadow-xs hover:bg-color-surface1/70',
        ghost: 'text-on-bg-secondary hover:bg-color-surface1 hover:text-color-secondary',
        link: 'text-on-bg-default underline-offset-4 hover:underline',
      },
      zSize: {
        default: 'h-lg px-sm py-md has-[>svg]:px-sm',
        sm: 'h-md rounded-md px-xs py-sm has-[>svg]:px-xs',
        lg: 'h-xl rounded-md px-md py-md has-[>svg]:px-md',
        icon: 'size-lg',
      },
      zShape: {
        default: 'rounded-xs',
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
