import axios from 'axios'

// Fungsi bantu untuk ambil cookie
function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
}

// Buat instance axios utama
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
})

// Interceptor untuk CSRF token otomatis disisipkan jika ada cookie XSRF
API.interceptors.request.use(config => {
  const xsrfToken = getCookie('XSRF-TOKEN')
  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken)
  }
  return config
})

API.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 419) {
      try {
        // Ambil ulang CSRF token
        await API.get('/sanctum/csrf-cookie')

        // Ulangi request asli dengan token baru
        const originalRequest = error.config
        return API(originalRequest)
      } catch (err) {
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default API