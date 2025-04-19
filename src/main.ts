import './assets/main.css';

import { createApp } from 'vue';

import { coreRouter } from '@/application/core/infrastructure/core.router.ts';
import { pinia } from '@/application/core/infrastructure/core.store.ts';

import App from './App.vue';

const app = createApp(App);

app.use(pinia).use(coreRouter);

app.mount('#app');
