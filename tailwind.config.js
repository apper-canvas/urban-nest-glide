/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1e3a5f",
          dark: "#152a47",
          light: "#2d5280",
        },
        secondary: {
          DEFAULT: "#c9a961",
          dark: "#b39551",
          light: "#d4b976",
        },
        accent: {
          DEFAULT: "#e67e22",
          dark: "#d35400",
          light: "#f39c12",
        },
        surface: "#ffffff",
        background: "#f8f9fa",
        success: "#27ae60",
        warning: "#f39c12",
        error: "#e74c3c",
        info: "#3498db",
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body: ["Inter", "sans-serif"],
      },
      fontSize: {
        base: "16px",
        lg: "20px",
        xl: "25px",
        "2xl": "31px",
        "3xl": "39px",
      },
      boxShadow: {
        card: "0 2px 8px rgba(0, 0, 0, 0.08)",
        "card-hover": "0 4px 16px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};