// tailwind.config.js
module.exports = {
  theme: {
    colors: {
      primary: "#0055AA",
      secondary: "#FFAA00",
      background: "#003366",
      card: "#999999",
      text: "#FFFFFF",
      border: "#fdfe33",
      notification: "#33fefe",
      customCard: "#4CAF50",
      green: {
        50: "#81C784"
      },
      silver: "#c0c0c0",
      sky: "#94a3b8",
      transparent: "transparent",
      text: "#E0E0E0",
      black: {
        50: "rgba(0,0,0,0.05)",
        100: "rgba(0,0,0,0.1)",
        200: "rgba(0,0,0,0.2)",
        300: "rgba(0,0,0,0.3)",
        400: "rgba(0,0,0,0.4)",
        500: "rgba(0,0,0,0.5)",
        600: "rgba(0,0,0,0.6)",
        700: "rgba(0,0,0,0.7)",
        800: "rgba(0,0,0,0.8)",
        900: "rgba(0,0,0,0.9)"
      },
      white: "#ffffff",
      blue: {
        50: "#eff6ff",
        100: "#dbeafe",
        200: "#bfdbfe",
        300: "#93c5fd",
        400: "#60a5fa",
        500: "#3b82f6",
        600: "#2563eb",
        700: "#1d4ed8",
        800: "#1e40af",
        900: "#1e3a8a"
      }
    },
    fontFamily: {
      vazir: ["Vazir-Regular", "sans-serif"],
      "vazir-bold": ["Vazir-Bold", "sans-serif"]
    },
    screens: {
      sm: "380px",
      md: "420px",
      lg: "680px",
      // or maybe name them after devices for `tablet:flex-row`
      tablet: "1024px"
    }
  }
};
