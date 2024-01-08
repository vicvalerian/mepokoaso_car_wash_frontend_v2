<template>
	<v-main>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Detail Transaksi Kedai</h1>
			</div>
			<v-card>
				<v-card-text class="dialog-confirm-content">
					<v-container fluid>
						<div>
							<v-text-field
								v-model="form.no_penjualan"
								label="Nomor Transaksi Penjualan"
								variant="underlined"
								readonly></v-text-field>
							<v-select
								:items="penjaga_kedai_list"
								item-title="nama"
								item-value="id"
								v-model="form.karyawan_id"
								label="Pelayan"
								required
								variant="underlined"
								readonly></v-select>
							<div class="d-flex">
								<v-text-field
									type="date"
									v-model="form.tgl_penjualan"
									label="Tanggal Penjualan"
									prepend-icon="mdi-calendar-blank-outline"
									variant="underlined"
									readonly></v-text-field>
								<v-spacer></v-spacer>
								<v-text-field
									v-model="form.waktu_penjualan"
									label="Waktu Penjualan"
									prepend-icon="mdi-clock-time-four-outline"
									variant="underlined"
									readonly></v-text-field>
							</div>
							<v-text-field
								v-model="form.total_penjualan"
								label="Total Penjualan"
								variant="underlined"
								readonly></v-text-field>
							<h2 class="pages--subtitle">daftar pesanan</h2>
							<v-data-table :headers="list.headers" :items="list.datas" class="elevation-3">
								<template v-slot:[`item.nomor`]="{ item }">
									<span>{{ list.datas.indexOf(item) + 1 }}</span>
								</template>
								<template v-slot:[`item.pivot.sub_total`]="{ item }">
									<span>{{ formatRupiah(item.pivot.sub_total, 'Rp') }}</span>
								</template>
								<template v-slot:no-data>
									<div color="white" class="red--text" icon="warning">
										<b>Maaf, tidak ada data tersedia.</b>
									</div>
								</template>
							</v-data-table>
						</div>
					</v-container>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn dense class="primary--btn" @click="goToListTransaksiKedai()">Tutup</v-btn>
				</v-card-actions>
			</v-card>
		</div>
	</v-main>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			userLogin: JSON.parse(localStorage.getItem('userLogin')),
			id: this.$route.params.id,
			selected: [],
			penjaga_kedai_list: [],
			form: {
				no_penjualan: '',
				karyawan_id: '',
				total_penjualan: '',
				tgl_penjualan: '',
				waktu_penjualan: '',
			},
			list: {
				headers: [],
				datas: [],
			},
		};
	},
	created() {
		this.initialize();
	},
	methods: {
		initialize() {
			this.list.headers = [
				{ title: 'No', value: 'nomor' },
				{ title: 'Nama Menu', value: 'nama' },
				{ title: 'Kuantitas', value: 'pivot.kuantitas' },
				{ title: 'Subtotal', value: 'pivot.sub_total' },
			];

			this.axioData();
			this.axioKaryawan();
		},

		async axioData() {
			try {
				let url = 'api/transaksi-kedai/' + this.id;

				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.get(url, { headers });
				if (response.status == 200) {
					this.form = response.data.data;
					this.form.total_penjualan = this.formatRupiah(response.data.data.total_penjualan, 'Rp');
					this.list.datas = response.data.data.menu_kedai;
				}
			} catch (error) {
				console.log(error);
			}
		},
		async axioKaryawan() {
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let url = 'api/list-selection-karyawan';

				const response = await axios.get(url, { headers });
				if (response.status == 200) {
					let data = JSON.parse(JSON.stringify(response.data));
					data.forEach((item) => {
						let dashboard = item;
						dashboard.text = item.nama;
						dashboard.value = item.id;
						this.penjaga_kedai_list.push(dashboard);
					});
				}
			} catch (error) {
				console.log(error);
			}
		},

		goToListTransaksiKedai() {
			this.$router.push('/transaksi-kedai');
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
	},
};
</script>
