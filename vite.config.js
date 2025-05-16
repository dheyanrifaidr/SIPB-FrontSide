import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://sipb.crulxproject.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost'
      },
      '/sanctum': {
        target: 'https://sipb.crulxproject.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost'
      },
      '/login': {
        target: 'https://sipb.crulxproject.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost'
      },
      '/register': {
        target: 'https://sipb.crulxproject.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost'
      },
      '/forgot-password': {
        target: 'https://sipb.crulxproject.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost'
      },
      '/reset-password': {
        target: 'https://sipb.crulxproject.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost'
      }
    },
    cors: true,
    allowedHosts: ['fe-sipb.crulxproject.com', 'localhost'],
    historyApiFallback: true
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})