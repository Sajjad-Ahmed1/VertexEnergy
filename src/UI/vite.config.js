import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    // Target modern browsers — smaller output, better tree-shaking
    target: 'es2020',
    // Warn if any chunk exceeds 500 kB (helps catch bundle bloat early)
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        // Split vendor deps from app code — vendors are cached across deploys
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-charts': ['recharts'],
          'vendor-icons': ['lucide-react']
        }
      }
    }
  }
})
