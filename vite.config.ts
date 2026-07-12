import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Proxy /fysiek_fabriek_portal naar poort 5175
      '/fysiek_fabriek_portal': {
        target: 'http://localhost:5175',
        changeOrigin: true,
        ws: true
      },
      // Proxy /project_intake_scan naar poort 5176
      '/project_intake_scan': {
        target: 'http://localhost:5176',
        changeOrigin: true,
        ws: true
      },
      // Proxy /maatwerk_risico_scan naar poort 5177
      '/maatwerk_risico_scan': {
        target: 'http://localhost:5177',
        changeOrigin: true,
        ws: true
      },
      // Proxy /project_intake_checklist naar poort 5178
      '/project_intake_checklist': {
        target: 'http://localhost:5178',
        changeOrigin: true,
        ws: true
      },
      '^/(?!fysiek_fabriek_portal|project_intake_scan|maatwerk_risico_scan|project_intake_checklist)(.*)': {
        target: 'http://localhost:5174',
        changeOrigin: true,
        ws: true
      }
    }
  }
})
