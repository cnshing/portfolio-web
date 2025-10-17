import { cva, VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xs text-md font-medium transition-all active:scale-95 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      zType: {
        default: 'bg-color-button text-on-bg-button shadow-xs hover:bg-color-button/90',
        destructive: 'bg-destructive text-color-default shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20',
        outline: 'border-color-button border shadow-xs bg-none text-border-button hover:border-color-button/50',
        secondary: 'bg-secondary border-color-subtle border text-secondary-foreground shadow-xs hover:bg-secondary/50',
        ghost: 'text-on-bg-secondary hover:bg-color-surface1 hover:text-color-secondary',
        link: 'text-on-bg-default underline-offset-4 hover:underline',
      },
      zSize: {
        default: 'h-11 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-10 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-12 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
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
