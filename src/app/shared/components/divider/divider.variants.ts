import { cva, VariantProps } from 'class-variance-authority';

export const dividerVariants = cva('bg-border-default block', {
  variants: {
    zOrientation: {
      horizontal: 'h-[0.03125rem] w-full',
      vertical: 'w-[0.03125rem] h-full inline-block',
    },
    zSpacing: {
      none: '',
      sm: '',
      md: '',
      default: '',
      lg: '',
      xl: '',
      '2xl': '',
      '3xl': '',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
    zSpacing: 'default',
  },
  compoundVariants: [
    {
      zOrientation: 'horizontal',
      zSpacing: 'sm',
      class: 'my-xs',
    },
    {
      zOrientation: 'horizontal',
      zSpacing: 'default',
      class: 'my-sm',
    },
    {
      zOrientation: 'horizontal',
      zSpacing: 'md',
      class: 'my-sm',
    },
    {
      zOrientation: 'horizontal',
      zSpacing: 'lg',
      class: 'my-lg',
    },
    {
      zOrientation: 'horizontal',
      zSpacing: 'xl',
      class: 'my-xl',
    },
    {
      zOrientation: 'horizontal',
      zSpacing: '2xl',
      class: 'my-2xl',
    },
    {
      zOrientation: 'horizontal',
      zSpacing: '3xl',
      class: 'my-3xl',
    },
    {
      zOrientation: 'vertical',
      zSpacing: 'sm',
      class: 'mx-xs',
    },
    {
      zOrientation: 'vertical',
      zSpacing: 'default',
      class: 'mx-xs',
    },
    {
      zOrientation: 'vertical',
      zSpacing: 'md',
      class: 'mx-sm',
    },
    {
      zOrientation: 'vertical',
      zSpacing: 'lg',
      class: 'mx-lg',
    },
    {
      zOrientation: 'vertical',
      zSpacing: 'xl',
      class: 'mx-xl',
    },
    {
      zOrientation: 'vertical',
      zSpacing: '2xl',
      class: 'mx-2xl',
    },
    {
      zOrientation: 'vertical',
      zSpacing: '3xl',
      class: 'mx-3xl',
    },
  ],
});

export type ZardDividerVariants = VariantProps<typeof dividerVariants>;
