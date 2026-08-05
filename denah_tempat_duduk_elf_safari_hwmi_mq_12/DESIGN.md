---
name: Sacred Horizon Dark Mode
colors:
  surface: '#280905'
  surface-dim: '#280905'
  surface-bright: '#572e27'
  surface-container-lowest: '#220503'
  surface-container-low: '#33110c'
  surface-container: '#381510'
  surface-container-high: '#451f19'
  surface-container-highest: '#522923'
  on-surface: '#ffdad4'
  on-surface-variant: '#dec0bb'
  inverse-surface: '#ffdad4'
  inverse-on-surface: '#4d251f'
  outline: '#a58b86'
  outline-variant: '#57423e'
  surface-tint: '#ffb4a8'
  primary: '#ffb4a8'
  on-primary: '#640b05'
  primary-container: '#550000'
  on-primary-container: '#e16857'
  inverse-primary: '#a43b2d'
  secondary: '#e9c176'
  on-secondary: '#412d00'
  secondary-container: '#604403'
  on-secondary-container: '#dab36a'
  tertiary: '#ffb3ad'
  on-tertiary: '#68010a'
  tertiary-container: '#550006'
  on-tertiary-container: '#e7635c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#ffb4a8'
  on-primary-fixed: '#410000'
  on-primary-fixed-variant: '#842419'
  secondary-fixed: '#ffdea5'
  secondary-fixed-dim: '#e9c176'
  on-secondary-fixed: '#261900'
  on-secondary-fixed-variant: '#5d4201'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3ad'
  on-tertiary-fixed: '#410004'
  on-tertiary-fixed-variant: '#881d1e'
  background: '#280905'
  on-background: '#ffdad4'
  surface-variant: '#522923'
typography:
  display-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md-mobile:
    fontFamily: Noto Serif
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1200px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style
The design system is a study in quiet power and spiritual gravity. It is designed for platforms that require an atmosphere of reverence, wisdom, and professional stability. The aesthetic is "Ethereal Professionalism"—a fusion of high-contrast minimalism and deep, immersive tones.

The style prioritizes clarity and focus, utilizing expansive whitespace (or "dark-space") to let content breathe. It draws inspiration from modern editorial design and contemplative spaces, evoking an emotional response of calm, focus, and trust. The visual language avoids frantic movement, favoring steady, deliberate transitions and a structured hierarchy that guides the user with quiet authority.

## Colors
The palette is rooted in a deep, near-black Maroon (#120000) for the primary surface, ensuring a sense of infinite depth. The signature color is a saturated Deep Maroon (#550000), used for primary actions and key brand moments. 

To ensure legibility and a "sacred" feel, we employ an Antique Gold (#C5A059) as a secondary accent for highlights and high-importance signifiers. Text is never pure white; instead, it uses a high-contrast cream (#F5F5F5) for primary content and a muted rose-grey (#A08888) for secondary information to reduce eye strain while maintaining the warmth of the maroon foundation.

## Typography
The typography strategy balances the traditional authority of serifs with the contemporary accessibility of geometric sans-serifs. 

**Noto Serif** is reserved for headlines and display text, providing a literary and established feel. It should be typeset with slightly tighter letter-spacing in larger sizes to maintain visual tension. 

**Plus Jakarta Sans** is used for all functional UI elements, body copy, and labels. Its soft, rounded terminals provide a necessary friendliness that offsets the intensity of the dark maroon palette. For body text, a generous line-height is mandatory to preserve readability against the high-contrast background.

## Layout & Spacing
The design system utilizes a fixed-width 12-column grid for desktop environments to create a sense of contained, intentional composition. On mobile devices, the layout shifts to a fluid single-column structure with 20px side margins.

The spacing rhythm is strictly based on an 8px scale. Large vertical gaps are encouraged between sections (e.g., 80px or 120px) to simulate the feeling of a physical gallery or a high-end editorial spread. Elements should be grouped with tight internal spacing (8px, 16px) but separated by large external margins (40px+) to emphasize the hierarchy of information.

## Elevation & Depth
In this dark mode environment, depth is not conveyed through heavy drop shadows, but through **Tonal Layering** and **Subtle Inner Glows**. 

Higher elevation levels are represented by progressively lightening the maroon surface. A base card sits at a slightly lighter value than the background, while a modal window uses a noticeably warmer, lighter maroon tint. 

To enhance the spiritual aesthetic, elevated elements feature a 1px inner border (top and left only) in a low-opacity Gold or Maroon-white to simulate a subtle "rim light" catching the edge of the object. Shadows, when used, are wide-reaching, low-opacity, and tinted with the primary Maroon (#550000) to ensure they feel like an extension of the atmosphere rather than a grey smudge.

## Shapes
This design system uses a "Soft" (0.25rem) corner radius. This choice is deliberate: sharp corners feel too aggressive for a spiritual context, while fully rounded corners (pills) feel too informal for a professional one. 

The 4px - 12px radius range provides a sophisticated architectural feel. Large containers like cards and modals should use the `rounded-lg` (8px) or `rounded-xl` (12px) values to appear grounded and stable. Buttons and input fields should stick to the base 4px radius to maintain a crisp, precise appearance.

## Components

### Buttons
Primary buttons use the Deep Maroon (#550000) background with Cream text. Secondary buttons are "Ghost" style with a 1px Antique Gold border and Antique Gold text. Hover states should involve a subtle shift toward a brighter Red-Maroon (#8E2121) rather than a lightening of the base color.

### Cards & Containers
Cards utilize a "Surface-plus-one" approach—a slightly lighter maroon than the background (#1A0505). They should feature a very subtle 1px border in a muted maroon (#330000) to define the edge without creating harsh visual noise.

### Inputs & Form Fields
Fields are dark-filled (slightly darker than the background) with a bottom-only border in Antique Gold when focused. This "underlined" style contributes to the elegant, editorial feel. Labels should always be visible above the field in Noto Serif (Small).

### Chips & Tags
Chips are small, rectangular with 4px radii. They use a low-opacity Maroon fill with high-opacity text. For status-specific chips (e.g., "Active"), use the Antique Gold color for text only, keeping the container neutral to avoid breaking the palette's harmony.

### Navigation
The navigation bar should be semi-transparent with a heavy background blur (backdrop-filter) to allow the deep maroon colors of the page to bleed through as the user scrolls, maintaining the "Horizon" metaphor.