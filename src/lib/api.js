import axios from 'axios'
// import { useAuthStore } from '@/stores/auth'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
  }
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    // console.log('Token:', token);  // Debug this part to ensure the token is correct
  }
  return config
})

export default API
