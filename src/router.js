import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import LoginPage from './pages/LoginPage.vue';

function importComponent(path) {
	return () => import(`./components/${path}.vue`);
}

function importPage(path) {
	return () => import(`./pages/${path}.vue`);
}

const routes = [
	{
		path: '/',
		name: 'home',
		component: HomeView,
	},
	{
		path: '/login',
		component: LoginPage,
	},
	{
		path: '',
		component: importComponent('DashboardLayout'),
		children: [
			{
				path: '/dashboard',
				component: importPage('dashboard/DashboardPage'),
			},
			{
				path: '/jabatan',
				component: importPage('jabatan/ListJabatan'),
			},
			{
				path: '/karyawan',
				component: importPage('karyawan/ListKaryawan'),
			},
			{
				path: '/jenis-kendaraan',
				component: importPage('jenis-kendaraan/ListJenisKendaraan'),
			},
			{
				path: '/kendaraan',
				component: importPage('kendaraan/ListKendaraan'),
			},
			{
				path: '/mobil-pelanggan',
				component: importPage('mobil-pelanggan/ListMobilPelanggan'),
			},
		],
	},
	{
		path: '/about',
		name: 'about',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ './views/AboutView.vue'),
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
