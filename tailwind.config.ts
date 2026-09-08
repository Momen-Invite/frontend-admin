import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      // ─── Material Design 3 Color Tokens (dari referensi Stitch) ───────────────
      colors: {
        // Shadcn/ui compatibility tokens (tetap dipertahankan)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },

        // ─── MD3 Primary (Amber/Gold — brand Momen Invite) ──────────────────────
        primary: {
          DEFAULT: "#835400",
          foreground: "#ffffff",
          fixed: "#ffddb5",
          "fixed-dim": "#ffb956",
          container: "#f2a93b",
          "on-container": "#664000",
        },
        "on-primary": "#ffffff",
        "on-primary-fixed": "#2a1800",
        "on-primary-fixed-variant": "#633f00",
        "inverse-primary": "#ffb956",
        "surface-tint": "#835400",

        // ─── MD3 Secondary (Brown/Tan) ────────────────────────────────────────
        secondary: {
          DEFAULT: "#755a2a",
          foreground: "#ffffff",
          fixed: "#ffdeaa",
          "fixed-dim": "#e5c187",
          container: "#fdd79c",
          "on-container": "#785c2c",
        },
        "on-secondary": "#ffffff",
        "on-secondary-fixed": "#271900",
        "on-secondary-fixed-variant": "#5b4314",

        // ─── MD3 Tertiary (Blue) ──────────────────────────────────────────────
        tertiary: {
          DEFAULT: "#005faf",
          foreground: "#ffffff",
          fixed: "#d4e3ff",
          "fixed-dim": "#a6c8ff",
          container: "#8ab9ff",
          "on-container": "#004888",
        },
        "on-tertiary": "#ffffff",
        "on-tertiary-fixed": "#001c3a",
        "on-tertiary-fixed-variant": "#004786",

        // ─── MD3 Error ─────────────────────────────────────────────────────────
        error: {
          DEFAULT: "#dc2626",
          foreground: "#ffffff",
          container: "#ffdad6",
          "on-container": "#93000a",
        },
        "on-error": "#ffffff",

        // ─── MD3 Surface & Background ─────────────────────────────────────────
        surface: "#f8f9fb",
        "surface-dim": "#d9dadc",
        "surface-bright": "#f8f9fb",
        "surface-variant": "#e1e2e4",
        "surface-container": {
          DEFAULT: "#edeef0",
          low: "#f3f4f6",
          lowest: "#ffffff",
          high: "#e7e8ea",
          highest: "#e1e2e4",
        },
        "on-surface": "#16181d",
        "on-surface-variant": "#514535",
        "inverse-surface": "#2e3132",
        "inverse-on-surface": "#f0f1f3",

        // ─── MD3 Outline & Misc ────────────────────────────────────────────────
        outline: "#847563",
        "outline-variant": "#d6c3af",
        "on-background": "#191c1e",

        // ─── Semantic Aliases ─────────────────────────────────────────────────
        success: {
          DEFAULT: "#16a34a",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#b45309",
          foreground: "#ffffff",
        },
        info: {
          DEFAULT: "#0284c7",
          foreground: "#ffffff",
        },

        // ─── shadcn card compat ───────────────────────────────────────────────
        card: {
          DEFAULT: "#ffffff",
          foreground: "#16181d",
        },
      },

      // ─── Border Radius ────────────────────────────────────────────────────────
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px",
      },

      // ─── Spacing ──────────────────────────────────────────────────────────────
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "40px",
        gutter: "24px",
        "sidebar-width": "96px",
      },

      // ─── Font Family ─────────────────────────────────────────────────────────
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "button-text": ["Inter", "sans-serif"],
        "label-capsule": ["Inter", "sans-serif"],
        "data-numeric": ["Inter", "sans-serif"],
      },

      // ─── Font Size (with lineHeight, letterSpacing, fontWeight) ──────────────
      fontSize: {
        display: [
          "40px",
          { lineHeight: "1.15", letterSpacing: "-0.03em", fontWeight: "800" },
        ],
        "headline-lg": [
          "30px",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-lg-mobile": [
          "22px",
          { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        "headline-md": [
          "18px",
          { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" },
        ],
        "body-lg": [
          "15px",
          { lineHeight: "1.6", letterSpacing: "0", fontWeight: "400" },
        ],
        "body-sm": [
          "13px",
          { lineHeight: "1.5", letterSpacing: "0", fontWeight: "400" },
        ],
        "button-text": [
          "14px",
          { lineHeight: "1", letterSpacing: "0", fontWeight: "600" },
        ],
        "label-capsule": [
          "12px",
          { lineHeight: "1", letterSpacing: "0.02em", fontWeight: "600" },
        ],
        "data-numeric": [
          "15px",
          { lineHeight: "1.6", letterSpacing: "0", fontWeight: "600" },
        ],
      },

      // ─── Box Shadow ────────────────────────────────────────────────────────
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0,0,0,0.05), 0 1px 3px 0 rgba(0,0,0,0.1)",
        card: "0 1px 2px 0 rgba(0,0,0,0.05), 0 1px 3px 0 rgba(0,0,0,0.1)",
        overlay:
          "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
      },

      // ─── Keyframes & Animations ────────────────────────────────────────────
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "fade-up": {
          from: { transform: "translateY(8px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "skeleton-shimmer": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-subtle": "pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "fade-up": "fade-up 0.4s ease-out",
        "skeleton-shimmer": "skeleton-shimmer 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
