import { cva, VariantProps } from 'class-variance-authority';

export const cardVariants = cva('block rounded-md border border-color-default bg-color-surface1 text-color-primary shadow-sm w-full p-lg', {
  variants: {},
});
export type ZardCardVariants = VariantProps<typeof cardVariants>;

export const cardHeaderVariants = cva('flex flex-col pb-0 gap-xs', {
  variants: {},
});
export type ZardCardHeaderVariants = VariantProps<typeof cardHeaderVariants>;

export const cardBodyVariants = cva('block', {
  variants: {},
});
export type ZardCardBodyVariants = VariantProps<typeof cardBodyVariants>;
