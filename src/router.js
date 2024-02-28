import { createRouter, createWebHistory } from 'vue-router';
// import HomeView from './views/HomeView.vue';
import LoginPage from './pages/LoginPage.vue';
import NotFound from './pages/NotFound.vue';

function importComponent(path) {
	return () => import(`./components/${path}.vue`);
}

function importPage(path) {
	return () => import(`./pages/${path}.vue`);
}

const routes = [
	{
		path: '',
		redirect: '/login',
	},
	{
		path: '/login',
		name: 'login',
		component: LoginPage,
	},
	{
		path: '',
		meta: { needsAuth: true },
		component: importComponent('DashboardLayout'),
		children: [
			{
				path: '/dashboard',
				name: 'dashboard',
				component: importPage('dashboard/DashboardPage'),
			},
			{
				path: '/jabatan',
				name: 'jabatan',
				component: importPage('jabatan/ListJabatan'),
			},
			{
				path: '/karyawan',
				name: 'karyawan',
				component: importPage('karyawan/ListKaryawan'),
			},
			{
				path: '/jenis-kendaraan',
				name: 'jenis-kendaraan',
				component: importPage('jenis-kendaraan/ListJenisKendaraan'),
			},
			{
				path: '/kendaraan',
				name: 'kendaraan',
				component: importPage('kendaraan/ListKendaraan'),
			},
			{
				path: '/mobil-pelanggan',
				name: 'mobil-pelanggan',
				component: importPage('mobil-pelanggan/ListMobilPelanggan'),
			},
			{
				path: '/menu-kedai',
				name: 'menu-kedai',
				component: importPage('menu-kedai/ListMenuKedai'),
			},
			{
				path: '/peminjaman-karyawan',
				name: 'peminjaman-karyawan',
				component: importPage('peminjaman-karyawan/ListPeminjamanKaryawan'),
			},
			{
				path: '/gaji-karyawan',
				name: 'gaji-karyawan',
				component: importPage('gaji-karyawan/ListGajiKaryawan'),
			},
			{
				path: '/pengeluaran-kedai',
				name: 'pengeluaran-kedai',
				component: importPage('pengeluaran-kedai/ListPengeluaranKedai'),
			},
			{
				path: '/transaksi-kedai',
				name: 'transaksi-kedai',
				component: importPage('transaksi-kedai/ListTransaksiKedai'),
			},
			{
				path: '/transaksi-kedai/tambah',
				name: 'transaksi-kedai-tambah',
				component: importPage('transaksi-kedai/AddTransaksiKedai'),
			},
			{
				path: '/transaksi-kedai/ubah/:id',
				name: 'transaksi-kedai-ubah',
				component: importPage('transaksi-kedai/EditTransaksiKedai'),
			},
			{
				path: '/transaksi-kedai/detail/:id',
				name: 'transaksi-kedai-detail',
				component: importPage('transaksi-kedai/DetailTransaksiKedai'),
			},
			{
				path: '/transaksi-pencucian',
				name: 'transaksi-pencucian',
				component: importPage('transaksi-pencucian/ListTransaksiPencucian'),
			},
			{
				path: '/transaksi-pencucian/tambah',
				name: 'transaksi-pencucian-tambah',
				component: importPage('transaksi-pencucian/AddTransaksiPencucian'),
			},
			{
				path: '/transaksi-pencucian/ubah/:id',
				name: 'transaksi-pencucian-ubah',
				component: importPage('transaksi-pencucian/EditTransaksiPencucian'),
			},
			{
				path: '/transaksi-pencucian/detail/:id',
				name: 'transaksi-pencucian-detail',
				component: importPage('transaksi-pencucian/DetailTransaksiPencucian'),
			},
			{
				path: '/pembelanjaan-harian',
				name: 'pembelanjaan-harian',
				component: importPage('pembelanjaan-harian/ListPembelanjaanHarian'),
			},
			{
				path: '/profil',
				name: 'profil',
				component: importPage('profil/ProfilePage'),
			},
			{
				path: '/laporan',
				name: 'laporan',
				component: importPage('laporan/LaporanPage'),
			},
			{
				path: '/impor',
				name: 'import',
				component: importPage('import/ImportPage'),
			},
		],
	},
	{ path: '/:notFound(.*)', component: NotFound },
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

router.beforeEach(function (to, from, next) {
	let userLogin = JSON.parse(localStorage.getItem('userLogin')) ?? null;

	if (to.meta.needsAuth) {
		if (userLogin) {
			next();
		} else {
			next({ name: 'login' });
		}
	} else {
		if (userLogin) {
			next({ name: 'dashboard' });
		} else {
			next();
		}
	}
});

export default router;
