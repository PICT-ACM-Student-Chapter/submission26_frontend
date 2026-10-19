import {
  extendTheme,
  withDefaultColorScheme,
  theme as baseTheme,
} from "@chakra-ui/react";
import { Input } from "./components/input.theme";
import { Button } from "./components/button.theme";
import { Container } from "./components/container.theme";
import { Select } from "./components/select.theme";

export const customTheme = extendTheme(
  {
    colors: {
      // Pulzion 26 Palette
      background: {
        100: "#030512", // Deep space dark
        200: "#071024", // Deep navy container
        300: "#0B152E", // Glass card top
      },
      foreground: {
        100: "#F8FAFC", // Pure white/ice text
        200: "#CBD5E1",
      },
      primary: {
        100: "#A7F3D0",
        200: "#6EE7B7",
        300: "#22D3EE", // Electric Cyan
        400: "#38D9A9", // Signature Pulzion 26 Mint Green
        500: "#159097",
        600: "#0D6569",
      },
      secondary: {
        100: "#BAE6FD",
        200: "#7DD3FC",
        300: "#38BDF8",
        400: "#22D3EE", // Electric Cyan
        500: "#0284C7",
      },
      accent: {
        100: "#FEF3C7",
        200: "#FDE68A",
        300: "#F8D092", // Pulzion 26 Warm Gold/Amber
        400: "#F59E0B",
      },
      muted: {
        100: "#1E293B",
        200: "#0F172A",
        300: "#070B19",
      },
      border: {
        100: "rgba(56, 217, 169, 0.3)",
        200: "rgba(255, 255, 255, 0.15)",
      },
      chart: {
        1: "#22D3EE",
        2: "#38D9A9",
        3: "#F8D092",
        4: "#38BDF8",
        5: "#818CF8",
      },
    },

    styles: {
      global: () => ({
        "html, body": {
          bg: "#030512",
          color: "#F8FAFC",
          fontFamily: "'Inter', sans-serif",
          minHeight: "100vh",
          backgroundImage: `
            radial-gradient(ellipse 60% 40% at 20% 10%, rgba(34, 211, 238, 0.08) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 80% 90%, rgba(56, 217, 169, 0.08) 0%, transparent 70%)
          `,
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
        },
        "h1, h2, h3, h4, h5, h6": {
          fontFamily: "'Orbitron', sans-serif !important",
          letterSpacing: "0.06em",
        },
        "*::placeholder": {
          color: "rgba(203, 213, 225, 0.5)",
        },
        "*": {
          borderColor: "rgba(56, 217, 169, 0.25)",
        },
      }),
    },

    fonts: {
      heading: `'Orbitron', -apple-system, sans-serif`,
      body: `'Inter', -apple-system, sans-serif`,
    },

    components: {
      Input,
      Button,
      Container,
      Select,
    },

    radii: {
      none: "0px",
      sm: "2px",
      md: "4px",
      lg: "8px",
      xl: "12px",
    },
  },
  withDefaultColorScheme({ colorScheme: "primary" })
);
