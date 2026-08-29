---
name: Quiet Ledger
colors:
  surface: '#f8f9fb'
  surface-dim: '#e5e7eb'
  surface-bright: '#f8f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f6'
  surface-container: '#edeef0'
  surface-container-high: '#e7e8ea'
  surface-container-highest: '#e1e2e4'
  on-surface: '#16181d'
  on-surface-variant: '#6b7280'
  inverse-surface: '#1f2226'
  inverse-on-surface: '#f0f1f3'
  outline: '#847563'
  outline-variant: '#d6c3af'
  surface-tint: '#835400'
  primary: '#835400'
  on-primary: '#ffffff'
  primary-container: '#f2a93b'
  on-primary-container: '#664000'
  inverse-primary: '#ffb956'
  secondary: '#755a2a'
  on-secondary: '#ffffff'
  secondary-container: '#fdd79c'
  on-secondary-container: '#785c2c'
  tertiary: '#005faf'
  on-tertiary: '#ffffff'
  tertiary-container: '#8ab9ff'
  on-tertiary-container: '#004888'
  error: '#dc2626'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffddb5'
  primary-fixed-dim: '#ffb956'
  on-primary-fixed: '#2a1800'
  on-primary-fixed-variant: '#633f00'
  secondary-fixed: '#ffdeaa'
  secondary-fixed-dim: '#e5c187'
  on-secondary-fixed: '#271900'
  on-secondary-fixed-variant: '#5b4314'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#a6c8ff'
  on-tertiary-fixed: '#001c3a'
  on-tertiary-fixed-variant: '#004786'
  background: '#f8f9fb'
  on-background: '#191c1e'
  surface-variant: '#e1e2e4'
  success: '#16a34a'
  warning: '#b45309'
typography:
  display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.15'
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.6'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-capsule:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.02em
  button-text:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: '0'
  data-numeric:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '600'
    lineHeight: '1.6'
    letterSpacing: '0'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  sidebar-width: 96px
  gutter: 24px
---

## Brand & Style

The design system is built on the philosophy of a "Quiet Ledger"—a precise, tranquil fintech environment that prioritizes clarity and functional focus over decorative flair. The aesthetic utilizes a high-contrast relationship between a cool, flat foundation and elevated, pure-white modules. 

The brand personality is authoritative yet unobtrusive, drawing from **Modern Corporate** and **Minimalist** movements. It utilizes a "Gray Canvas, White Cards, Amber Signal" hierarchy. The primary emotional response should be one of organized calm, where the UI acts as a silent, efficient steward of financial data. Color is never used for decoration; it is a "signal" reserved for active states, primary actions, and critical data highlights.

## Colors

The palette is strictly functional. The base layer is a cool, neutral gray that serves as a non-distracting background "desk." Pure white is reserved for interactive cards and containers, creating an immediate sense of elevation and importance.

**Primary Amber (#f2a93b)** serves as the sole signal color. It is used with extreme restraint to highlight a single active state, such as a selected sidebar icon or a primary button. 

**Semantic Statuses** (Success, Error, Warning) follow a specific pattern: they are rendered as low-saturation background containers with highly saturated foreground text. This ensures that while status is clear, it does not overwhelm the "quiet" nature of the ledger. Text hierarchy is managed through `on-surface` (near-black) for high-impact content and `on-surface-variant` (mid-gray) for metadata and labels.

## Typography

This design system exclusively uses **Inter** to maintain a utilitarian, data-centric feel. The typographic hierarchy relies on weight and tracking rather than font variation.

- **Headlines:** Set with heavy weights (700-800) and tight negative letter-spacing for a compact, authoritative appearance.
- **Numeric Data:** Currency and figures should always utilize the `data-numeric` style, which uses a heavier weight than standard body text to ensure financial values are the first elements scanned.
- **Metadata:** Table headers and labels should use `body-sm` in `on-surface-variant` to recede visually, allowing the actual data to sit in the foreground.

## Layout & Spacing

The layout is built on a strict **8px grid** system. It uses a **Fixed Grid** approach for primary containers to ensure data integrity and consistent scanning.

- **The Sidebar:** A slim, 96px icon-only sidebar that is treated as an inset floating card, rather than a full-height bezel. It should have consistent margins from the viewport edges.
- **Main Content:** Arranged in a multi-column layout on desktop, typically featuring a 2:1 ratio between primary data lists (right) and utility widgets (left).
- **Rhythm:** Internal card padding defaults to `md` (16px) for compact elements and scales to `lg` (24px) for primary data tables. No vertical grid lines are used in tables; only horizontal dividers provide separation.

## Elevation & Depth

Depth is established through **Tonal Layers** and extremely diffused **Ambient Shadows**.

- **Surface Layer (Level 0):** The base `#f3f4f6` gray. It is perfectly flat.
- **Card Layer (Level 1):** Pure white surfaces that use `rounded-xl` corners. They are elevated by a dual-stack shadow: a tight 1px/2px blur for definition and a broader 1px/3px blur for softness.
- **Overlay Layer (Level 2):** Tooltips and dropdowns. These use high-contrast dark fills (`inverse-surface`) or white with a much deeper, crisper shadow to signify they are temporary and sit highest in the Z-space.
- **Separation:** Divisions within cards (like table rows) use a hairline 1px border in `outline-variant`. No full borders should be used on cards.

## Shapes

The shape language is **Rounded but Restrained**. While corners are soft, the use of pills for specific interactive elements creates a clear visual grammar for "clickability."

- **Primary Cards:** Use `rounded-xl` (1.75rem) to emphasize the "floating" nature of the modules.
- **Interactive Elements:** Search bars, filter buttons, and status badges must use a **Pill-shaped** (`full`) radius.
- **Form Controls:** Inputs and standard buttons use a more precise `rounded` (0.625rem) setting to distinguish them from the broader container shapes.

## Components

### Buttons & Inputs
- **Primary Buttons:** Solid Amber background with dark text. Corners are `rounded`.
- **Search & Filters:** Styled as white pills with subtle `on-surface-variant` icons.
- **Drag-to-Action:** Uses a full-width track with a distinct leading icon, serving as a high-intent confirmation gesture.

### Navigation
- **Sidebar:** Icons are uncontained by default. The active selection is indicated by a solid Amber circle containing the icon. Settings and secondary navigation are anchored to the bottom of the sidebar card.

### Data Display
- **Status Badges:** Fully rounded capsules using semantic pastel backgrounds. Text is centered and utilizes `label-capsule`.
- **Tables:** Rows are separated by a single hairline divider. The first column often features a `rounded-md` merchant or brand tile. Numeric columns are right-aligned.
- **Charts:** Vertical bars with fully rounded tops. Use a pale amber tint for the series and solid primary amber for the "selected" or "current" data point. Tooltips are dark capsules anchored above the selected bar.