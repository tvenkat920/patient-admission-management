import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base works cleanly across GitHub Pages, Netlify, and local preview
  base: './',
  server: {
    port: 5173,
    host: true,
  }
})
