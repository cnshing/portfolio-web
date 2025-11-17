import { cva, VariantProps } from 'class-variance-authority';

export const avatarVariants = cva('relative flex flex-row items-center justify-center box-content cursor-default', {
  variants: {
    zType: {
      default: 'bg-color-button text-on-bg-button hover:bg-color-button/default',
      destructive: 'bg-destructive text-color-default hover:bg-destructive/strong',
      outline: 'border border-color-button bg-none text-border-button hover:bg-color-surface1/subtle',
      secondary: 'bg-color-surface1 border border-color-default text-color-default hover:bg-color-surface1/default',
      ghost: 'text-on-bg-secondary bg-none hover:bg-color-surface2 hover:text-color-secondary shadow-sm'
    },
    zSize: {
      default: 'w-lg h-lg text-base',
      sm: 'w-lg h-lg text-base',
      md: 'w-xl h-xl text-lg',
      lg: 'w-2xl h-2xl text-2xl',
      full: 'w-full h-full',
      none: 'text-[10cqw]'
    },
    zShape: {
      default: 'rounded-sm',
      circle: 'rounded-full',
      square: 'rounded-none',
    },
    zStatus: {
      online: 'online',
      offline: 'offline',
      doNotDisturb: 'doNotDisturb',
      away: 'away',
      invisible: 'invisible',
    },
    zLoading: {
      true: 'opacity-100',
    },
  },
  defaultVariants: {
    zType: 'default',
    zSize: 'default',
    zShape: 'default',
  },
});

export const imageVariants = cva('relative object-cover object-center w-full h-full z-10', {
  variants: {
    zShape: {
      default: 'rounded-sm',
      circle: 'rounded-full',
      square: 'rounded-none',
    },
  },
  defaultVariants: {
    zShape: 'default',
  },
});

export const avatarGroupVariants = cva('flex items-center [&_img]:ring-2 [&_img]:ring-background', {
  variants: {
    zOrientation: {
      horizontal: 'flex-row -space-x-3',
      vertical: 'flex-col -space-y-3',
    },
  },
  defaultVariants: {
    zOrientation: 'horizontal',
  },
});

export type ZardImageVariants = VariantProps<typeof imageVariants>;
export type ZardAvatarVariants = VariantProps<typeof avatarVariants>
export type ZardAvatarGroupVariants = VariantProps<typeof avatarGroupVariants>;