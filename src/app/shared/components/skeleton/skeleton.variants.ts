import { cva, VariantProps } from 'class-variance-authority';

export const skeletonVariants = cva('bg-color-surface2 animate-pulse rounded-md');
export type ZardSkeletonVariants = VariantProps<typeof skeletonVariants>;
