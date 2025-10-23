import { cva, VariantProps } from 'class-variance-authority';

// Layout Variants
export const layoutVariants = cva('flex w-full min-h-0', {
  variants: {
    zDirection: {
      horizontal: 'flex-row',
      vertical: 'flex-col',
      auto: 'flex-col',
    },
  },
  defaultVariants: {
    zDirection: 'auto',
  },
});
export type LayoutVariants = VariantProps<typeof layoutVariants>;

// Header Variants
export const headerVariants = cva('flex items-center px-2xl bg-color-page shrink-0', {
  variants: {},
});
export type HeaderVariants = VariantProps<typeof headerVariants>;

// Footer Variants
export const footerVariants = cva('flex items-center px-lg bg-color-page shrink-0', {
  variants: {},
});
export type FooterVariants = VariantProps<typeof footerVariants>;

// Content Variants
export const contentVariants = cva('flex-1 flex flex-col overflow-auto bg-color-page p-2xl min-h-dvh');
export type ContentVariants = VariantProps<typeof contentVariants>;

// Sidebar Variants
export const sidebarVariants = cva(
  'relative flex flex-col h-full transition-all duration-300 ease-in-out border-r shrink-0 p-md bg-color-page text-color-default font-secondary border-color-strong',
);

export const sidebarTriggerVariants = cva(
  'absolute bottom-4 z-10 flex items-center justify-center cursor-pointer rounded-sm border border-color-default bg-color-surface1 hover:bg-sidebar-accent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 w-6 h-6 -right-3',
);

// Sidebar Group Variants
export const sidebarGroupVariants = cva('flex flex-col gap-1');

export const sidebarGroupLabelVariants = cva(
  'flex h-sm shrink-0 items-center rounded-md px-xs text-md font-tertiary text-color-tertiary outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 focus-visible:ring-sidebar-ring [&>svg]:size-4 [&>svg]:shrink-0',
);
