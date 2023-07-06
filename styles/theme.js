// theme.ts

// 1. import `extendTheme` function
import { extendTheme } from "@chakra-ui/react";

// 2. Add your color mode config
const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const fonts = { heading: `"Nunito", sans-serif`, body: `"Nunito", sans-serif` };

// 3. extend the theme
const theme = extendTheme({ config, fonts });

export default theme;
