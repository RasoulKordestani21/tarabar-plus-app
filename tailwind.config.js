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
      customCard: "#4CAF50"
    },
    fontFamily: {
      vazir: ["Vazir-Regular", "sans-serif"]
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
