<template>
	<v-main>
		<v-overlay :model-value="overlay" class="align-center justify-center">
			<img src="@/assets/loading.svg" height="150" />
		</v-overlay>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Ubah Transaksi Kedai</h1>
			</div>
			<div class="transaksi-kedai-layout">
				<div class="list-menu-layout">
					<div class="search-menu-layout">
						<v-form @submit.prevent="xSearch()">
							<v-text-field
								:placeholder="'Masukkan minimal 3 kata kunci lalu tekan `Enter`'"
								class="textfield--search"
								v-model="keyword"
								append-inner-icon="mdi-magnify"
								variant="outlined"
								single-line
								hide-details></v-text-field>
						</v-form>
					</div>
					<div class="group-menu-layout">
						<v-item-group mandatory>
							<div class="group-menu">
								<div v-for="(item, index) in jenis_menu_list" :key="index">
									<v-item v-slot="{ toggle }">
										<v-card
											:color="isActive(index) ? '#316291' : ''"
											height="50"
											class="group-menu-card"
											@click="toggle"
											@click.stop="
												activateItem(index);
												axioMenuKedai(item.value);
											">
											<v-scroll-y-transition>
												<div class="group-menu-title">
													<v-icon :class="isActive(index) ? 'white--text' : 'black--text'">{{
														item.icon
													}}</v-icon>
													<h4>{{ item.name }}</h4>
												</div>
											</v-scroll-y-transition>
										</v-card>
									</v-item>
								</div>
							</div>
						</v-item-group>
					</div>
					<div class="group-food-layout">
						<v-item-group>
							<div class="group-food">
								<div v-for="(item, index) in menu_kedai_list" :key="index">
									<v-item>
										<v-card elevation="6">
											<v-card-title class="justify-center">
												<v-card
													color="#316291"
													width="100%"
													height="100"
													elevation="0"
													class="justify-center">
													<v-icon v-if="item.jenis == 'Makanan'" color="white" size="x-large"
														>mdi-rice</v-icon
													>
													<v-icon v-else color="white" size="x-large">mdi-cup</v-icon>
												</v-card>
											</v-card-title>
											<v-card-text style="height: 50px">
												<h3 color="#333" style="text-align: left">{{ item.nama }}</h3>
											</v-card-text>
											<v-card-actions>
												<v-chip variant="outlined" color="#193149"
													><span style="font-weight: 700">{{
														formatRupiah(item.harga, 'Rp')
													}}</span></v-chip
												>
												<v-spacer></v-spacer>
												<v-btn
													variant="outlined"
													class="primary--btn"
													@click="insertTableMenu(item)">
													<v-icon>mdi-plus</v-icon>
												</v-btn>
											</v-card-actions>
										</v-card>
									</v-item>
								</div>
							</div>
						</v-item-group>
					</div>
				</div>
				<div class="ordered-menu-layout">
					<v-card class="elevation-5">
						<template v-slot:title>
							<div class="order-summary-title">
								<span class="summary-title">Daftar Pesanan</span>
								<span class="summary-detail"
									>{{ form.tgl_penjualan_show }}, {{ form.waktu_penjualan }}</span
								>
							</div>
						</template>
						<template v-slot:text>
							<v-data-table :headers="list.headers" :items="list.datas" class="elevation-2">
								<template v-slot:[`item.kuantitas`]="{ item }">
									<v-text-field
										type="number"
										min="1"
										variant="underlined"
										v-model="item.kuantitas"
										@change="calculateQty(item)"></v-text-field>
								</template>
								<template v-slot:[`item.sub_total_show`]="{ item }">
									<v-text-field
										variant="underlined"
										v-model="item.sub_total_show"
										readonly></v-text-field>
								</template>
								<template v-slot:[`item.actions`]="{ item }">
									<v-icon
										dense
										color="#316291"
										@click="deleteTableMenu(item.id)"
										class="data-table-icon"
										>mdi-delete</v-icon
									>
								</template>
								<template v-slot:no-data>
									<div color="white" icon="warning">
										<b>Silahkan tambah pesanan.</b>
									</div>
								</template>
							</v-data-table>
							<div class="ordered-subtotal-layout">
								<div class="ordered-subtotal-layout-item">
									<span>Subtotal</span>
									<span>{{ form.total_penjualan_show }}</span>
								</div>
							</div>
						</template>
						<template v-slot:actions>
							<v-btn class="primary--btn btn-tambah-pesanan" :loading="btnLoading" @click="saveData"
								>Simpan Pesanan</v-btn
							>
						</template>
					</v-card>
				</div>
			</div>

			<base-snackbar
				v-model="snackbar.status"
				:color="snackbar.color"
				:message="snackbar.message"></base-snackbar>
		</div>
	</v-main>
</template>

<style scoped>
.transaksi-kedai-layout {
	display: grid;
	grid-template-columns: 2.5fr 1.5fr;
	column-gap: 1rem;

	align-items: start;
}

.list-menu-layout {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	row-gap: 1.4rem;
}

.search-menu-layout {
	grid-column: 2/-1;
}

.group-menu-layout {
	grid-column: 1/-1;
}

.group-menu {
	display: flex;
	align-items: center;
	gap: 1rem;
}
.group-menu-card {
	display: flex;
	align-items: center;
	justify-content: center;

	padding: 1rem;
}
.group-menu-title {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.2rem;
}

.group-food-layout {
	grid-column: 1/-1;
}

.group-food {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	column-gap: 1.2rem;
	row-gap: 1.2rem;
}

.justify-center {
	display: flex;
	justify-content: center;
	align-items: center;

	padding: 8px;
}

.ordered-menu-layout {
	display: flex;
	flex-direction: column;
}

.order-summary-title {
	display: flex;
	align-items: center;
	justify-content: space-between;

	margin-bottom: 1rem;

	letter-spacing: -0.5px;
}

.summary-title {
	color: #333;
	font-size: 1.4rem;
	font-weight: 700;
}

.summary-detail {
	color: #444;
	font-size: 1rem;
}

.ordered-subtotal-layout {
	margin-top: 1.4rem;
	padding: 1.2rem;
	border-radius: 5px;
	background-color: #e9ecef;

	color: #343a40;
	font-weight: 700;
	font-size: 1rem;
}

.ordered-subtotal-layout-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.btn-tambah-pesanan {
	width: 100%;
}
</style>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			userLogin: JSON.parse(localStorage.getItem('userLogin')),
			id: this.$route.params.id,
			jenis_menu_list: [
				{ name: 'Semua', value: '', icon: 'mdi-silverware' },
				{ name: 'Makanan', value: 'Makanan', icon: 'mdi-rice' },
				{ name: 'Minuman', value: 'Minuman', icon: 'mdi-cup' },
			],
			jenis_menu: '',
			penjaga_kedai_list: [],
			menu_kedai_list: [],
			snackbar: {
				snackbarNotif: false,
				color: '',
				message: '',
			},
			form: {
				total_penjualan: '',
				total_penjualan_show: '',
				tgl_penjualan: new Date().toISOString().substr(0, 10),
				tgl_penjualan_show: '',
				waktu_penjualan: '',
				detail_transaksi_kedai: [],
			},
			list: {
				headers: [],
				datas: [],
			},
			keyword: '',
			overlay: true,
			btnLoading: false,
			activeItemIndex: 0,
		};
	},
	created() {
		this.initialize();
		this.axioData();
		this.setFieldDateTime();
		this.calculateTotal();
	},
	methods: {
		isActive(index) {
			return this.activeItemIndex === index;
		},
		activateItem(index) {
			this.activeItemIndex = index;
		},
		initialize() {
			this.list.headers = [
				{ title: 'Nama Menu', value: 'nama', width: '30%' },
				{ title: 'Kuantitas', value: 'kuantitas', width: '15%' },
				{ title: 'Subtotal', value: 'sub_total_show' },
				{ title: 'Aksi', value: 'actions', sortable: false },
			];

			this.axioMenuKedai('');
		},

		async axioData() {
			try {
				this.overlay = true;
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let url = 'api/transaksi-kedai/' + this.id;

				const response = await axios.get(url, { headers });
				if (response.status == 200) {
					this.form.total_penjualan = response.data.data.total_penjualan;
					this.form.tgl_penjualan = response.data.data.tgl_penjualan;
					this.form.waktu_penjualan = response.data.data.waktu_penjualan;
					this.form.total_penjualan_show = this.formatRupiah(
						response.data.data.total_penjualan,
						'Rp'
					);

					let tempMenuKedai = response.data.data.menu_kedai;
					tempMenuKedai.map((x) => {
						let d = JSON.parse(JSON.stringify(x));
						d.menu_kedai_id = x.pivot.menu_kedai_id;
						d.kuantitas = x.pivot.kuantitas;
						d.sub_total = x.pivot.sub_total;
						d.sub_total_show = this.formatRupiah(x.pivot.sub_total, 'Rp');
						d.nama = x.nama;
						d.harga = x.harga;
						this.list.datas.push(d);
					});

					this.form.detail_transaksi_kedai = [];
					this.list.datas.map((x) => {
						let dashboard = x.id;
						this.form.detail_transaksi_kedai.push(dashboard);
					});

					setTimeout(() => {
						this.overlay = false;
					}, 300);
				}
			} catch (error) {
				console.log(error);

				setTimeout(() => {
					this.overlay = false;
				}, 300);
			}
		},

		async axioMenuKedai(jenis) {
			this.jenis_menu = jenis;
			this.overlay = true;
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let url = `api/menu-kedai-jenis?jenis=${jenis}`;

				const response = await axios.get(url, { headers });
				if (response.status == 200) {
					this.menu_kedai_list = response.data.data;

					setTimeout(() => {
						this.overlay = false;
					}, 300);
				}
			} catch (error) {
				console.log(error);

				setTimeout(() => {
					this.overlay = false;
				}, 300);
			}
		},

		async xSearch() {
			if (this.keyword.length >= 1 && this.keyword.length <= 2) {
				this.snackbar.status = true;
				this.snackbar.color = 'red';
				this.snackbar.message = 'Harap masukkan minimal 3 kata pencarian!';

				return;
			}

			this.overlay = true;
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let url = `api/menu-kedai-jenis?jenis=${this.jenis_menu}&keyword=${this.keyword}`;

				const response = await axios.get(url, { headers });
				if (response.status == 200) {
					this.menu_kedai_list = response.data.data;

					setTimeout(() => {
						this.overlay = false;
					}, 300);
				}
			} catch (error) {
				console.log(error);

				setTimeout(() => {
					this.overlay = false;
				}, 300);
			}
		},

		setFieldDateTime() {
			let now = new Date();
			let hours = now.getHours();
			let minutes = now.getMinutes();
			let seconds = now.getSeconds();
			this.form.waktu_penjualan = hours + ':' + minutes + ':' + seconds;

			const options = { day: 'numeric', month: 'long', year: 'numeric' };
			const date = new Date(this.form.tgl_penjualan);
			this.form.tgl_penjualan_show = date.toLocaleDateString('id-ID', options);
		},

		async saveData() {
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				this.btnLoading = true;
				let data = {
					tgl_penjualan: this.form.tgl_penjualan,
					waktu_penjualan: this.form.waktu_penjualan,
					total_penjualan: this.form.total_penjualan,
					detail_transaksi_kedai: this.list.datas,
				};

				var url = 'api/transaksi-kedai/' + this.id;

				const response = await axios.post(url, data, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;

					setTimeout(() => {
						this.goToListTransaksiKedai();
					}, 500);
				}
			} catch (error) {
				this.snackbar.message = error.response.data.message;
				this.snackbar.color = 'red';
				this.snackbar.status = true;
				this.btnLoading = false;
			}
		},

		insertTableMenu(item) {
			this.overlay = true;

			let found = false;
			let arrIndex = 0;
			for (let index = 0; index < this.list.datas.length; index++) {
				if (this.list.datas[index].id == item.id) {
					found = true;
					arrIndex = index;
				}
			}

			if (!found) {
				item.menu_kedai_id = item.id;
				item.kuantitas = 1;
				item.sub_total = item.harga;
				item.sub_total_show = this.formatRupiah(item.harga, 'Rp');
				this.list.datas.push(item);
				this.calculateTotal();
			} else {
				this.list.datas[arrIndex].kuantitas = this.list.datas[arrIndex].kuantitas + 1;
				this.list.datas[arrIndex].sub_total = this.list.datas[arrIndex].sub_total + item.harga;
				this.list.datas[arrIndex].sub_total_show = this.formatRupiah(
					this.list.datas[arrIndex].sub_total,
					'Rp'
				);
				this.calculateTotal();
			}

			setTimeout(() => {
				this.overlay = false;
			}, 300);
		},

		deleteTableMenu(item) {
			let objWithIdIndex = this.list.datas.findIndex((obj) => obj.id === item);

			if (objWithIdIndex > -1) {
				this.list.datas.splice(objWithIdIndex, 1);
				this.calculateTotal();
			}
		},

		goToListTransaksiKedai() {
			this.$router.push(`/transaksi-kedai`);
		},

		calculateQty(value) {
			this.list.datas.map((x) => {
				if (x.id == value.id) {
					let quantity = x.kuantitas * value.harga;
					x.sub_total = quantity;
					x.sub_total_show = this.formatRupiah(quantity, 'Rp');
				}
			});
			this.calculateTotal();
		},

		calculateTotal() {
			let total = 0;
			this.list.datas.map((x) => {
				total = total + x.sub_total;
			});
			this.form.total_penjualan = total;
			this.form.total_penjualan_show = this.formatRupiah(total, 'Rp');
		},

		formatRupiah(value, prefix) {
			let number_string = value.toString();
			let split = number_string.split(',');
			let sisa = split[0].length % 3;
			let rupiah = split[0].substr(0, sisa);
			let ribuan = split[0].substr(sisa).match(/\d{3}/gi);

			// tambahkan titik jika yang di input sudah menjadi angka ribuan
			if (ribuan) {
				let separator = sisa ? '.' : '';
				rupiah += separator + ribuan.join('.');
			}

			rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
			return prefix == undefined ? rupiah : rupiah ? 'Rp' + rupiah : '';
		},

		formatTanggal(value) {
			return value.split('-').reverse().join('-');
		},
	},
	computed: {},
};
</script>
