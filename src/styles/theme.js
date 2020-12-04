import { theme, DefaultTheme } from "@chakra-ui/core";

const customTheme = {
  ...theme,
  fonts: {
    body: '"Avenir Next", system-ui, sans-serif',
    heading: '"Avenir Next", system-ui, sans-serif',
    mono: "Menlo, monospace",
  },
  fontWeight: {
    ...theme.fontWeights,
    normal: 400,
    medium: 600,
    bold: 700,
  },
  radii: {
    ...theme.radii,
    sm: "5px",
    md: "8px",
  },
  fontSize: {
    ...theme.fontSize,
  },
  colors: {
    ...theme.colors,
    purple: {
      ...theme.colors.purple,
      500: "#801857",
      600: "#a92765",
    },
    gray: {
      ...theme.colors.gray,
      300: "#f3f2f0",
      600: "#29292e",
      700: "#202024",
      800: "#121214",
      900: "#eae8e6",
    },
  },
};

export default customTheme;
