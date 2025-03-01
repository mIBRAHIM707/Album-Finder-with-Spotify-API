import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/token': {
        target: 'https://accounts.spotify.com/api/token',
        changeOrigin: true,
        rewrite: (path) => '',
        secure: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Token proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Token Request:', req.method);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Token Response:', proxyRes.statusCode);
          });
        }
      },
      '/api': {
        target: 'https://api.spotify.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: true,
        headers: {
          'Origin': 'http://localhost:5173'
        },
        timeout: 30000,
        proxyTimeout: 30000,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('API proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Preserve authorization header
            const authHeader = req.headers['authorization'];
            if (authHeader) {
              proxyReq.setHeader('Authorization', authHeader);
            }
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
})
