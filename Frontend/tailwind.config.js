/** @type {import('tailwindcss').Config} */
//import tailwindScrollbarHide from 'tailwind-scrollbar-hide';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scrollbar: ['rounded'],
    },
  },
  // plugins: [
  //   tailwindScrollbarHide,
  // ],
}