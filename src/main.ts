import './assets/main.css';

import { createPinia } from 'pinia';
import { createApp } from 'vue';

const pinia = createPinia();
import { coreRouter } from '@/router';

import App from './App.vue';

const app = createApp(App);

app.use(pinia).use(coreRouter);

app.mount('#app');
