import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base to repo name for GitHub Pages deployment
  // Override with VITE_BASE env var if deploying under a custom path
  base: process.env.VITE_BASE ?? './',
})
