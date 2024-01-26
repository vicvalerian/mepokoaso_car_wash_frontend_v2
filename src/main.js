import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';
import vuetify from '@/plugins/vuetify';
import axios from 'axios';
import VueApexCharts from "vue3-apexcharts";

// local component import
import BaseSnackbar from './components/ui/BaseSnackbar.vue';
import BaseTable from './components/ui/BaseTable.vue';

const app = createApp(App);

axios.defaults.baseURL = 'http://127.0.0.1:8000';

app.use(vuetify);
app.use(router);
app.use(VueApexCharts);

app.component('base-snackbar', BaseSnackbar);
app.component('base-table', BaseTable);

app.mount('#app');
