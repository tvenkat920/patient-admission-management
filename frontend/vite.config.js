import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use repo name as base for GitHub Pages: https://tvenkat920.github.io/patient-admission-management/
  base: '/patient-admission-management/',
  server: {
    port: 5173,
    host: true,
  }
})
