// import {
//     extendTheme,
//     withDefaultColorScheme,
//     theme as baseTheme,
//   } from "@chakra-ui/react";
//   import { Input } from "./components/input.theme";
//   import { mode } from "@chakra-ui/theme-tools";
//   import { Button } from "./components/button.theme";
//   import { Container } from "./components/container.theme";
//   import { Select } from "./components/select.theme";
//   export const customTheme = extendTheme(
//     {
//       colors: {
//         dark: {
//           100: "#2E3440",
//           200: "#292E39",
//         },
//         light: {
//           100: "#FFFFFF",
//           200: "#F8F9FB",
//         },
//         primaries: {
//           100: '#e0e0e6', // Swatch 7
//           200: '#999cac', // Swatch 2
//           300: '#73859d', // Swatch 5
//           400: '#5a7291', // Swatch 6
//           500: '#46526d', // Swatch 3
//           600: '#1b3357', // Swatch 4
//           700: '#01030c', // Swatch 1
//           800: '#0E0B16'
//         },
//         secondaries: {
//           900: "#222",
//           800: "#191919"
//         }
//       },
//       styles: {
//         global: (props) => ({
//           body: {
//             bg: mode("#FFFFFF", "#FFFFFF")(props),
//           },
//           "*::placeholder": {
//             color: mode("#FFFFFF", "#FFFFFF")(props),
//           },
//         }),
//       },
//       components: {
//         Input,
//         Button,
//         Container,
//         Select,
//       },
//     },
//     withDefaultColorScheme({ colorScheme: "green" })
//   );


import {
  extendTheme,
  withDefaultColorScheme,
  theme as baseTheme,
} from "@chakra-ui/react";
import { Input } from "./components/input.theme";
import { Button } from "./components/button.theme";
import { Container } from "./components/container.theme";
import { Select } from "./components/select.theme";
import { mode } from "@chakra-ui/theme-tools";

export const customTheme = extendTheme(
  {
    colors: {
      // Core palette based on your Tailwind base setup
      background: {
        100: "hsl(220, 40%, 5%)",   // Deep blue-black
        200: "hsl(220, 40%, 7%)",   // Slightly lighter card background
      },
      foreground: {
        100: "hsl(210, 40%, 100%)", // Pure white text
        200: "hsl(210, 40%, 98%)",
      },
      primary: {
        100: "hsl(188, 100%, 60%)",
        200: "hsl(188, 100%, 55%)",
        300: "hsl(188, 100%, 50%)",
        400: "hsl(188, 100%, 45%)", // Electric cyan
        500: "hsl(188, 100%, 40%)",
      },
      secondary: {
        100: "hsl(265, 82%, 75%)",
        200: "hsl(265, 82%, 70%)",
        300: "hsl(265, 82%, 65%)", // Bright purple accent
        400: "hsl(265, 82%, 60%)",
        500: "hsl(265, 82%, 55%)",
      },
      accent: {
        100: "hsl(0, 84%, 70%)",
        200: "hsl(0, 84%, 65%)",
        300: "hsl(0, 84%, 60%)", // Rogue Red
        400: "hsl(0, 84%, 55%)",
      },
      muted: {
        100: "hsl(217, 33%, 25%)",
        200: "hsl(217, 33%, 20%)",
        300: "hsl(217, 33%, 17%)",
      },
      border: {
        100: "hsl(217, 33%, 17%)",
      },
      chart: {
        1: "hsl(225, 70%, 50%)", // Persian blue
        2: "hsl(265, 82%, 65%)",
        3: "hsl(100, 66%, 63%)",
        4: "hsl(48, 96%, 53%)",
        5: "hsl(188, 100%, 45%)",
      },
    },

    styles: {
      global: (props) => ({
        "html, body": {
          bg: mode("hsl(210, 40%, 100%)", "hsl(220, 40%, 5%)")(props),
          color: mode("hsl(220, 40%, 5%)", "hsl(210, 40%, 100%)")(props),
          backgroundImage: mode(
            "none",
            `
              radial-gradient(at 0% 0%, hsl(188, 100%, 45%, 0.25) 0px, transparent 50%),
              radial-gradient(at 100% 0%, hsl(48, 96%, 53%, 0.25) 0px, transparent 50%)
            `
          )(props),
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
        },
        "*::placeholder": {
          color: mode("gray.400", "whiteAlpha.400")(props),
        },
        "*": {
          borderColor: "hsl(217, 33%, 17%)",
        },
      }),
    },

    fonts: {
      heading: `'Orbitron', ${baseTheme.fonts?.heading}`,
      body: `'Rajdhani', ${baseTheme.fonts?.body}`,
    },

    components: {
      Input,
      Button,
      Container,
      Select,
    },

    radii: {
      md: "0rem", // No rounded corners for cyberpunk aesthetic
    },
  },
  withDefaultColorScheme({ colorScheme: "primary" })
);
