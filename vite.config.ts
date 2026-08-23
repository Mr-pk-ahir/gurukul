import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Limit ne standard size par set kari chhe
    chunkSizeWarningLimit: 1500, 
    
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 1. React ane React-DOM mate alag file
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // 2. Cloudinary mate alag file (kem ke te heavy hoy chhe)
            if (id.includes('cloudinary')) {
              return 'cloudinary-vendor';
            }
            // 3. Baki na badha packages mate common file
            return 'vendor';
          }
        },
      },
    },
  },
})