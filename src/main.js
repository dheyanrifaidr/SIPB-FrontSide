import { createApp } from 'vue';
// import './style.css';
import './index.css';
import App from './App.vue';
import { createPinia } from 'pinia';
import router from './router';
import '@fontsource/inter';
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import { useUserStore } from './stores/userStore';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(Vue3Toastify, {
    autoClose: 3000,
    position: 'top-right'
  });

const userStore = useUserStore(pinia);
userStore.loadUserFromStorage();
  
router.isReady().then(() => {
    app.mount('#app')
});