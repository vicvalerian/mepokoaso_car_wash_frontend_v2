<template>
	<v-app>
		<div class="dashboard">
			<v-navigation-drawer :elevation="0" v-model="drawer" width="285">
				<v-list-item style="border-bottom: 1px solid #eee">
					<v-list-item-title class="navbar-title">Mepokoaso CarWash</v-list-item-title>
				</v-list-item>
				<v-divider></v-divider>
				<v-list open-strategy="single">
					<div v-for="(link, i) in links" :key="i">
						<v-list-item v-if="!link.subLinks" link :to="link.to" class="list-item-container">
							<div class="link-item">
								<v-icon :icon="link.icon" class="link-icon" size="small"></v-icon>
								<v-list-item-title class="navbar-item-title"> {{ link.title }}</v-list-item-title>
							</div>
						</v-list-item>
						<v-list-group
							v-else
							:key="link.title"
							:value="link.title"
							class="list-item-group-container">
							<template v-slot:activator="{ props }">
								<v-list-item v-bind="props" class="list-item-container">
									<div class="link-item">
										<v-icon :icon="link.icon" class="link-icon" size="small"></v-icon>
										<v-list-item-title class="navbar-item-title">
											{{ link.title }}
										</v-list-item-title>
									</div>
								</v-list-item>
							</template>
							<v-list-item
								v-for="sublink in link.subLinks"
								:key="sublink.title"
								:value="sublink.title"
								:to="sublink.to"
								link
								class="list-item-container">
								<div class="link-item">
									<v-icon :icon="sublink.icon" class="link-icon" size="small"></v-icon>
									<v-list-item-title class="navbar-item-title">
										{{ sublink.title }}
									</v-list-item-title>
								</div>
							</v-list-item>
						</v-list-group>
					</div>
				</v-list>
			</v-navigation-drawer>

			<!-- <v-app-bar :elevation="0" class="appbar">
				<template v-slot:append>
					<div class="appbar-avatar">
						<v-avatar :image="baseUrl + loggedInUser.photo"></v-avatar>
						<p class="appbar-username">{{ loggedInUser.name }}</p>
					</div>
				</template>
			</v-app-bar> -->
			<v-app-bar :elevation="0" class="appbar">
				<template v-slot:prepend>
					<v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
				</template>
				<template v-slot:append>
					<v-menu location="bottom" transition="slide-y-transition">
						<template v-slot:activator="{ props }">
							<div class="appbar-avatar" v-bind="props">
								<v-avatar :image="baseUrl + loggedInUser.photo"></v-avatar>
								<p class="appbar-username">{{ loggedInUser.name }}</p>
								<v-icon>mdi-menu-down</v-icon>
							</div>
						</template>

						<v-list>
							<div>
								<v-list-item link @click="goToProfile">
									<div class="link-item">
										<v-icon icon="mdi-account" class="link-icon" size="small"></v-icon>
										<v-list-item-title class="navbar-item-title">Profil</v-list-item-title>
									</div>
								</v-list-item>
								<v-divider></v-divider>
								<v-list-item link>
									<div class="link-item" @click="logout">
										<v-icon
											icon="mdi-logout-variant"
											class="link-icon logout"
											size="small"></v-icon>
										<v-list-item-title class="navbar-item-title logout">Keluar</v-list-item-title>
									</div>
								</v-list-item>
							</div>
						</v-list>
					</v-menu>
				</template>
			</v-app-bar>

			<div class="fullheight pages-bg">
				<router-view></router-view>
			</div>
		</div>
	</v-app>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			userLogin: JSON.parse(localStorage.getItem('userLogin')),
			drawer: true,
			loggedInUser: {
				name: '',
				photo: '',
			},
			baseUrl: 'http://127.0.0.1:8000/storage/',
			links: [
				{ title: 'Dashboard', to: '/dashboard', icon: 'mdi-dots-grid' },
				{
					title: 'Transaksi',
					icon: 'mdi-content-save-cog',
					subLinks: [
						{ title: 'Transaksi Kedai', to: '/transaksi-kedai', icon: 'mdi-store' },
						{ title: 'Transaksi Pencucian', to: '/transaksi-pencucian', icon: 'mdi-car-wash' },
					],
				},
				{
					title: 'Pengaturan Data',
					icon: 'mdi-database-cog',
					subLinks: [
						{ title: 'Jabatan', to: '/jabatan', icon: 'mdi-badge-account-horizontal-outline' },
						{ title: 'Karyawan', to: '/karyawan', icon: 'mdi-account-group' },
						{ title: 'Jenis Kendaraan', to: '/jenis-kendaraan', icon: 'mdi-car-info' },
						{ title: 'Kendaraan', to: '/kendaraan', icon: 'mdi-car' },
						{ title: 'Mobil Pelanggan', to: '/mobil-pelanggan', icon: 'mdi-account-key' },
						{ title: 'Menu Kedai', to: '/menu-kedai', icon: 'mdi-book-open' },
					],
				},
				{
					title: 'Administrasi Keuangan',
					icon: 'mdi-account-cash',
					subLinks: [
						{ title: 'Peminjaman Karyawan', to: '/peminjaman-karyawan', icon: 'mdi-checkbook' },
						{ title: 'Gaji Karyawan', to: '/gaji-karyawan', icon: 'mdi-cash' },
						{ title: 'Pengeluaran Kedai', to: '/pengeluaran-kedai', icon: 'mdi-cart-plus' },
						{ title: 'Pembelanjaan Harian', to: '/pembelanjaan-harian', icon: 'mdi-cart-variant' },
					],
				},
				{ title: 'Laporan', to: '/laporan', icon: 'mdi-file-document-outline' },
			],
		};
	},
	created() {
		this.getUserLoginInfo();
	},
	methods: {
		async getUserLoginInfo() {
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.get('api/profil/karyawan', { headers });
				if (response.status == 200) {
					this.loggedInUser.name = response.data.data.nama;
					this.loggedInUser.photo = response.data.data.foto;
				}
			} catch (error) {
				console.log(error);
			}
		},
		goToProfile() {
			this.$router.push('/profil');
		},
		async logout() {
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.get('api/logout', { headers });

				if (response.status == 200) {
					localStorage.removeItem('userLogin');
					this.$router.push('/login');
				}
			} catch (error) {
				console.log(error);
			}
		},
	},
};
</script>

<style scoped>
.navbar-title {
	padding-top: 1rem;
	padding-bottom: 1rem;
}

.appbar {
	background-color: #eaeff4;
	border-bottom: 1px solid #ccc;
}

.list-item-container {
	padding: 1.2rem 1rem 1.2rem 1.6rem;
}

.link-item {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	column-gap: 1.6rem;
}

.v-list-item--active {
	color: #316291;
	border-right: 4px solid #316291;
}

.navbar-title {
	font-size: 1.2rem;
	font-weight: 700;
	letter-spacing: 0.5px;
	text-align: center;
	color: #316291;
}

.navbar-item-title {
	/* color: #333; */
	font-size: 0.9rem;
	font-weight: 700;
	letter-spacing: -0.1px;
}

.appbar-avatar {
	display: flex;
	align-items: center;
	column-gap: 1.2rem;

	margin-right: 0.8rem;
}

.appbar-avatar:hover {
	cursor: pointer;
}

.appbar-username {
	color: #333;
	font-size: 1rem;
	font-weight: 700;
	letter-spacing: 0.01px;
}

.fullheight {
	min-height: 100vh !important;
}

.pages-bg {
	background-color: #eaeff4;
}

.logout {
	color: #f03e3e;
}
</style>
