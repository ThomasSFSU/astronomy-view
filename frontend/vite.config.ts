import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,       // listen on 0.0.0.0
    port: 5173,       // optional, default is 5173
    proxy: {
      "/api": "http://host.docker.internal:4000"
    }
  }
})