import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '127.0.0.2',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'https://sipb.crulxproject.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: '127.0.0.1'
      },
      '/sanctum': {
        target: 'https://sipb.crulxproject.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: '127.0.0.1'
      },
      '/login': {
        target: 'https://sipb.crulxproject.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: '127.0.0.1'
      },
      '/register': {
        target: 'https://sipb.crulxproject.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: '127.0.0.1'
      },
      '/forgot-password': {
        target: 'https://sipb.crulxproject.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: '127.0.0.1'
      },
      '/reset-password': {
        target: 'https://sipb.crulxproject.com',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: '127.0.0.1'
      }
    },
    cors: true,
    allowedHosts: ['fe-sipb.crulxproject.com', '127.0.0.2'],
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