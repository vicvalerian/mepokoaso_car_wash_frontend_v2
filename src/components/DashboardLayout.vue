<template>
	<v-app>
		<div class="dashboard">
			<v-navigation-drawer :elevation="0">
				<v-list-item style="border-bottom: 1px solid #eee">
					<v-list-item-title class="navbar-title">Mepokoaso CarWash</v-list-item-title>
				</v-list-item>
				<v-divider></v-divider>
				<div v-for="(link, i) in links" :key="i">
					<v-list-item link :to="link.to" class="list-item-container">
						<div class="link-item">
							<v-icon :icon="link.icon" class="link-icon" size="small"></v-icon>
							<v-list-item-title class="navbar-item-title">{{ link.title }}</v-list-item-title>
						</div>
					</v-list-item>
				</div>
			</v-navigation-drawer>

			<v-app-bar :elevation="0" class="appbar">
				<template v-slot:append>
					<div class="appbar-avatar">
						<v-avatar color="surface-variant"></v-avatar>
						<p class="appbar-username">Vicky Valerian</p>
					</div>
				</template>
			</v-app-bar>

			<div class="fullheight pages-bg">
				<router-view></router-view>
			</div>
		</div>
	</v-app>
</template>

<script>
export default {
	data() {
		return {
			links: [
				{ title: 'Dashboard', to: '/dashboard', icon: 'mdi-dots-grid' },
				{ title: 'Jabatan', to: '/jabatan', icon: 'mdi-badge-account-horizontal-outline' },
			],
		};
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
	justify-content: start;
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
</style>