import axios from 'axios'

// Fungsi bantu untuk ambil cookie
function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

// Buat instance axios utama
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://sipb.crulxproject.com',
  withCredentials: true, // Critical for stateful Sanctum
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  }
})

// Request interceptor with better logging
API.interceptors.request.use(
  config => {
    // Add XSRF-TOKEN if available
    const token = getCookie('XSRF-TOKEN')
    if (token) {
      // Decode the token before sending it
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token)

      // Debug: Log the token being sent
      // console.log('Sending CSRF token:', decodeURIComponent(token))
    }
    return config
  },
  error => {
    console.error('API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle common errors
API.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/'
    } else if (error.response?.status === 405) {
      console.error('Method not allowed. Check API endpoint:', error.config.url)
    }
    return Promise.reject(error)
  }
)

export default API