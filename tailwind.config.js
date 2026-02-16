/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // You can define your Vandehoeken blue here if you want
        vhblue: '#0f2943',
      },
    },
  },
  plugins: [],
}
