import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/project_intake_scan/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5176
  }
})
