import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  
  theme: {
    extend: {
      colors: {
        'gold': 'rgb(208, 168, 92)',
        'black':'#010a13',
        'red':'#be1e37',
        'blue':'#0a96aa',
        'tan':'#f1e7d3',
        'grey':'#a39f94',
      },
    }
  },
  plugins: [],
} satisfies Config;
