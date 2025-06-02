import defaultTheme from "tailwindcss/defaultTheme";
const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        blue: {
          700: "rgba(24, 72, 94, 0.7)",
          800: "rgba(24, 72, 94, 0.7)",
          900: "rgba(24, 72, 94, 1)",
        },
      },
    },
  },
  Plugins: [flowbite.plugin()],
};
