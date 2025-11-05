import { extendTailwindMerge } from 'tailwind-merge';
import { ClassValue, clsx } from 'clsx';

export type { ClassValue };

/**
 * A custom twMerge configured for our design system custom namespace
 */
export const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      color: ['default', 'subtle', 'accent', 'secondary', 'tertiary', 'surface1', 'surface2', 'page', 'page-gradient', 'button', 'strong', 'medium', 'company-icon', 'accent'],
      "font-weight": ['primary', 'secondary', 'tertiary']

    },
    classGroups: {
      'border-w': [{'border-width': ['default', 'lg', 'md']}]
    }
  }
})

export function mergeClasses(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transform(value: boolean | string): boolean {
  return typeof value === 'string' ? value === '' : value;
}