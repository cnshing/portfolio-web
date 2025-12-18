import { cva, VariantProps } from 'class-variance-authority';

/**
 * BAR LAYOUT LOGIC
 * ----------------
 * The blockquote padding defines the total horizontal space the bar
 * can occupy. We divide that space into 4 equal parts and use one of
 * them as the base bar width:
 *
 *   |<--------- padding --------->|
 *   |----|----|----|----|
 *        ^ base width = padding / 4
 *
 * To make the bar feel less thin and more balanced, we add a small
 * smoothing increment based on a diminishing fraction of the padding:
 *
 *   barWidth = (padding / 4) + ((padding / pow(2, FRACTION)) * 1/4)
 *
 * Finally, the bar is nudged slightly to the right because it doesn't look aligned.
 *
 *   leftOffset = barWidth / 10
 *
 */

export const blockquoteVariants = cva(
  `relative px-[1.125em] py-[1.125em]`
);

export const barVariants = cva(
  `absolute left-[0.02988em] top-0 h-full w-[0.2988em]`,
  {
    variants: {
      zType: {
        default: 'bg-brand-subtle',
        outline: 'bg-color-button',
        secondary: 'bg-color-surface2',
        ghost: 'bg-gray-400'
      },
      zShape: {
        default: 'rounded-xs',
        circle: 'rounded-lg',
        square: 'rounded-none',
      },
    },
    defaultVariants: {
      zType: 'default',
      zShape: 'default',
    },
  },
);

export type ZardBlockQuoteVariants = VariantProps<typeof blockquoteVariants>
export type ZardBlockQuoteBarVariants = VariantProps<typeof barVariants>
