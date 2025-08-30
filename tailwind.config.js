// /** @type {import('tailwindcss').Config} */
// import daisyui from "daisyui";

// export default {
//   content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}",],
//   theme: {
//     extend: {},
//   },
//   plugins: [daisyui],
//   daisyui: {
//     themes: ["light", "dark"], // default themes
//   },
// };


/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [], // no DaisyUI
};
