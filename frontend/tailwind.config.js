/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // scans all your React files
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            light: "#60A5FA", // Tailwind blue-400
            DEFAULT: "#2563EB", // Tailwind blue-600
            dark: "#1E3A8A", // Tailwind blue-900
          },
          orange: {
            light: "#FDBA74", // Tailwind orange-400
            DEFAULT: "#F97316", // Tailwind orange-500
            dark: "#C2410C", // Tailwind orange-700
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        soft: "0 4px 12px rgba(0,0,0,0.1)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
    },
  },
  plugins: [],
};
