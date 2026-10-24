import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// In development VITE_API_BASE_URL is empty, so API calls stay same-origin and are routed here by path,
// the way the API gateway routes them in production. Vite uses the first matching key.
const GAME_CATALOG = 'http://localhost:5001'
const USER_LIBRARY = 'http://localhost:5002'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    proxy: {
      '/api/v1/games': { target: GAME_CATALOG, changeOrigin: true },
      '/api/v1/platforms': { target: GAME_CATALOG, changeOrigin: true },
      '/api/v1/genres': { target: GAME_CATALOG, changeOrigin: true },
      '/api': { target: USER_LIBRARY, changeOrigin: true },
      '/hubs': { target: USER_LIBRARY, ws: true, changeOrigin: true },
    },
  },
})
