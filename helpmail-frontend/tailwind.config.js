/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        accent: "hsl(var(--accent))",
        destructive: "hsl(var(--destructive))",
        input: "hsl(var(--input))",
        border: "hsl(var(--border))",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
    },
  },
  plugins: [],
};
