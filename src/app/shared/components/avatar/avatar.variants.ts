import { cva, VariantProps } from 'class-variance-authority';

export const avatarVariants = cva('relative flex flex-row items-center justify-center box-content cursor-default', {
  variants: {
    zType: {
      default: 'bg-color-surface1 border border-color-default text-color-default hover:bg-color-surface1/87',
      destructive: 'bg-destructive text-color-default hover:bg-destructive/90',
      outline: 'border border-color-button bg-none text-border-button hover:border-color-button/50',
      secondary: 'bg-secondary border border-color-subtle text-secondary-foreground hover:bg-secondary/50',
      ghost: 'text-on-bg-secondary hover:bg-color-surface1 hover:text-color-secondary shadow-sm'
    },
    zSize: {
      default: 'w-lg h-lg',
      sm: 'w-lg h-lg',
      md: 'w-xl h-xl',
      lg: 'w-2xl h-2xl',
      full: 'w-full h-full',
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
    zBorder: {
      true: 'border-width-lg border-color-strong',
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

export type ZardAvatarImage = {
  zImage: {
    fallback: string;
    url?: string;
    alt?: string;
  };
};
export type ZardAvatarVariants = VariantProps<typeof avatarVariants> & ZardAvatarImage;
