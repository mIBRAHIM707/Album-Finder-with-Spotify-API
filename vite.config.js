import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Album-Finder-with-Spotify-API/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  },
  server: {
    proxy: {
      '/api/token': {
        target: 'https://accounts.spotify.com/api/token',
        changeOrigin: true,
        rewrite: (path) => '',
        secure: true,
      },
      '/api': {
        target: 'https://api.spotify.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
        headers: {
          'Origin': 'http://localhost:5173'
        },
      }
    }
  }
})
