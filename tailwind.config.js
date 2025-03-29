/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primaryTitle: '#0A2647',
        primaryContent: '#144272',
        primarySubcontent: '#205295',
        primaryBase: '#000000',//
        primaryAccent: '#000000',
        primaryBackground: '#f4f8fc',
        button: "#c6ddf1"

        /* color theme
        0A2647  Navy Blue
        144272
        205295
        2C74B3  Light Blue
        */

      }
    },
  },
  plugins: [],
}

