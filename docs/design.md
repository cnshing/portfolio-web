# Design

This section will mainly cover the "look and feel" of the site.

## Components

The component primitives were generated through [ZardUI](https://zardui.com/docs/components) and manually modified to fit the new theme. You can view all of the portfolio site's components [here](https://chansh.ing/playground).

## Design Tokens

The initial design tokens mix [Backbase](https://ds.backbase.com/design-tokens)'s semantic tokens and [Spectrum](https://spectrum.adobe.com/page/design-tokens/)'s three-part structure.

The implementation, however, contains duplicate tokens from both the initial design and Tailwind. Specifically, there is a unit-tested `themes.sass` file meant to convert the initial design tokens into Tailwind-compatible utilities. It is possible to use both simultaneously. For example:
`bg-brand` vs `bg-color-brand`.

This choice was made to adhere to the initial design while allowing developer flexibility when using Tailwind. Since the Tailwind utilities are deterministically generated from the initial design tokens, it is extremely likely both token versions will be consistent with each other.

## Figma

The Figma files are available in the `figma` folder. Unfortunately, the design looks nowhere close to the final version you see today. I hope it can serve as some form of insightful progression as you attempt to design your own site and bring it to production.