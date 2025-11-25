import { cva, VariantProps } from 'class-variance-authority';

export const cardVariants = cva('rounded-md border border-color-default bg-color-surface1 text-color-primary shadow-sm min-w-fit w-full p-lg flex flex-col gap-y-lg', {
  variants: {},
});
export type ZardCardVariants = VariantProps<typeof cardVariants>;

export const cardHeaderVariants = cva('flex flex-wrap gap-x-sm gap-y-lg items-center', {
  variants: {},
});
export type ZardCardHeaderVariants = VariantProps<typeof cardHeaderVariants>;

export const cardBodyVariants = cva('block empty:hidden h-full', {
  variants: {},
});
export type ZardCardBodyVariants = VariantProps<typeof cardBodyVariants>;
