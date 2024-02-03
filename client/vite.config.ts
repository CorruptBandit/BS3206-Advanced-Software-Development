import dotenv from 'dotenv';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';


const CLIENT_PORT = Number(process.env.CLIENT_PORT) || 3000;
const SERVER_PORT = Number(process.env.SERVER_PORT) || 3001;

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: {
    port: CLIENT_PORT,
    proxy: {
      '/api': {
        target: `http://localhost:${SERVER_PORT}`,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../dist/',
  },
})
