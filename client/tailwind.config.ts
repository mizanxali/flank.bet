import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      light: {
        1: "#6A5ACA",
        2: "#9D8DFD",
        3: "#8570FD",
        4: "#504398",
        5: "#B6A9FE",
        6: "#CEC6FE",
        7: "#E7E2FF",
        8: "#494262",
      },
      dark: {
        1: "#27243D",
        2: "#090A0B",
        3: "#202328",
        4: "#1A1631",
        5: "#202328",
      },
      alternate: {
        1: "#8DBAFD",
      },
      whites: {
        1: "#C7CAD1",
        2: "#9EA3AE",
        3: "#E2E5E9",
      },
      blacks: {
        1: "#000000",
      },
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;

// #8570FD33
