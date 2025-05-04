import { createApp } from 'vue'
import './style.css'
import './index.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import '@fontsource/inter'
// import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';


const app = createApp(App);

app.use(createPinia())
app.use(router)
// app.use(Vue3Toastify, {
//     autoClose: 3000,
//     position: 'top-right',
//   } as ToastContainerOptions);
  
app.mount('#app');