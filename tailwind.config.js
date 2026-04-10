/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        jua: ["Jua_400Regular"],
      },
      colors: {
        background: "var(--color-bg)",
        card: "var(--color-card)",
        text: "var(--color-text)",
        accent: "var(--color-accent)",
        nav: "var(--nav-bg)",
      },
    },
  },
  plugins: [],
}