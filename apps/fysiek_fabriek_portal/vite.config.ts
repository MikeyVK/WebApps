import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/fysiek_fabriek_portal/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5175
  }
})
