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
			{
				path: '/menu-kedai',
				component: importPage('menu-kedai/ListMenuKedai'),
			},
			{
				path: '/peminjaman-karyawan',
				component: importPage('peminjaman-karyawan/ListPeminjamanKaryawan'),
			},
			{
				path: '/gaji-karyawan',
				component: importPage('gaji-karyawan/ListGajiKaryawan'),
			},
			{
				path: '/pengeluaran-kedai',
				component: importPage('pengeluaran-kedai/ListPengeluaranKedai'),
			},
			{
				path: '/transaksi-kedai',
				component: importPage('transaksi-kedai/ListTransaksiKedai'),
			},
			{
				path: '/transaksi-kedai/tambah',
				component: importPage('transaksi-kedai/AddTransaksiKedai'),
			},
			{
				path: '/transaksi-kedai/ubah/:id',
				component: importPage('transaksi-kedai/EditTransaksiKedai'),
			},
			{
				path: '/transaksi-kedai/detail/:id',
				component: importPage('transaksi-kedai/DetailTransaksiKedai'),
			},
			{
				path: '/transaksi-pencucian',
				component: importPage('transaksi-pencucian/ListTransaksiPencucian'),
			},
			{
				path: '/transaksi-pencucian/tambah',
				component: importPage('transaksi-pencucian/AddTransaksiPencucian'),
			},
			{
				path: '/transaksi-pencucian/ubah/:id',
				component: importPage('transaksi-pencucian/EditTransaksiPencucian'),
			},
			{
				path: '/transaksi-pencucian/detail/:id',
				component: importPage('transaksi-pencucian/DetailTransaksiPencucian'),
			},
			{
				path: '/pembelanjaan-harian',
				component: importPage('pembelanjaan-harian/ListPembelanjaanHarian'),
			},
			{
				path: '/profil',
				component: importPage('profil/ProfilePage'),
			},
			{
				path: '/laporan',
				component: importPage('laporan/LaporanPage'),
			},
			{
				path: '/impor',
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

export default router;
