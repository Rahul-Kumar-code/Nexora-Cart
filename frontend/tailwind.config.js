module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"] ,
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        accent: "#f97316"
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
