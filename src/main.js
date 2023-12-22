import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import vuetify from '@/plugins/vuetify';

// local component import
import BaseSnackbar from './components/ui/BaseSnackbar.vue';

const app = createApp(App);

app.use(vuetify);
app.use(router);

app.component('base-snackbar', BaseSnackbar);

app.mount('#app');
