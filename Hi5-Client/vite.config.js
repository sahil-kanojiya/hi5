import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    proxy: {
      '/api/': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/resource': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // "/resource/user/": {
      //   target: "http://localhost:8080",
      //   changeOrigin: true,
      // },
      // "/resource/post/": {
      //   target: "http://localhost:8080",
      //   changeOrigin: true,
      // },
      // "/resource/story/": {
      //   target: "http://localhost:8080",
      //   changeOrigin: true,
      // },
      // "/resource/reel/": {
      //   target: "http://localhost:8080",
      //   changeOrigin: true,
      // },
      // "/resource/chat/": {
      //   target: "http://localhost:8080",
      //   changeOrigin: true,
      // },
    },
  },
  define: {
    global: 'window',
  },
});
