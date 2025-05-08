// web.js
import axios from "axios";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const WEB = axios.create({
  baseURL: 'https://sipb.crulxproject.com',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  }
})

// Tambahkan interceptor request untuk menyisipkan X-XSRF-TOKEN
WEB.interceptors.request.use(config => {
  const xsrfToken = getCookie('XSRF-TOKEN')
  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken)
  }
  return config
})

export default WEB;
