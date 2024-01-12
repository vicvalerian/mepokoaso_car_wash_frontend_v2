<template>
	<v-main>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Detail Transaksi Pencucian</h1>
			</div>
			<v-card>
				<v-card-text>
					<div class="one-row">
						<v-text-field
							v-model="form.no_pencucian"
							label="Nomor Transaksi Pencucian"
							variant="underlined"
							class="fixed-width-field"
							readonly></v-text-field>
						<v-text-field
							v-model="form.paid_at"
							label="Tanggal Pelunasan"
							variant="underlined"
							class="fixed-width-field"
							readonly></v-text-field>
					</div>
					<div class="one-row">
						<v-autocomplete
							v-model="form.kendaraan_id"
							:items="kendaraan_list"
							label="Nama Kendaraan"
							item-title="nama"
							item-value="id"
							variant="underlined"
							class="fixed-width-field"
							readonly></v-autocomplete>
						<v-text-field
							v-model="form.tarif_kendaraan"
							label="Tarif Kendaraan"
							variant="underlined"
							class="fixed-width-field"
							readonly></v-text-field>
					</div>
					<div class="one-row">
						<v-text-field
							v-model="form.no_polisi"
							label="Nomor Polisi"
							readonly
							class="fixed-width-field"
							variant="underlined"></v-text-field>
						<v-select
							:items="jenis_kendaraan_list"
							v-model="form.jenis_kendaraan"
							label="Jenis Kendaraan"
							class="fixed-width-field"
							variant="underlined"
							readonly></v-select>
					</div>

					<div class="one-row">
						<v-text-field
							v-model="form.tgl_pencucian"
							label="Tanggal Pencucian"
							class="fixed-width-field"
							variant="underlined"
							readonly></v-text-field>
						<v-text-field
							v-model="form.waktu_pencucian"
							label="Waktu Pencucian"
							class="fixed-width-field"
							variant="underlined"
							readonly></v-text-field>
					</div>

					<v-select
						:items="kasir_list"
						v-model="form.karyawan_id"
						label="Kasir"
						item-value="id"
						item-title="nama"
						variant="underlined"
						required
						readonly></v-select>

					<v-text-field
						v-model="form.status"
						label="Status"
						variant="underlined"
						readonly></v-text-field>

					<div class="one-row">
						<v-text-field
							v-model="form.is_free"
							label="Gratis"
							variant="underlined"
							class="fixed-width-field"
							readonly></v-text-field>
						<v-text-field
							v-model="form.is_save_mobil_pelanggan"
							label="Simpan Mobil Pelanggan"
							variant="underlined"
							class="fixed-width-field"
							readonly></v-text-field>
					</div>
					<div class="one-row">
						<v-text-field
							v-model="form.total_pembayaran"
							label="Total Pembayaran"
							variant="underlined"
							class="fixed-width-field"
							readonly></v-text-field>
						<v-text-field
							v-model="form.keuntungan"
							label="Keuntungan"
							variant="underlined"
							class="fixed-width-field"
							readonly></v-text-field>
					</div>

					<h2 class="pencuci-title">daftar pencuci</h2>
					<v-data-table :headers="list.headers" :items="list.datas" class="elevation-2">
						<template v-slot:[`item.pivot.upah_pencuci`]="{ item }">
							<span>{{ formatRupiah(item.pivot.upah_pencuci, 'Rp') }}</span>
						</template>
						<template v-slot:no-data>
							<div color="white" class="red--text" icon="warning">
								<b>Maaf, tidak ada data tersedia.</b>
							</div>
						</template>
					</v-data-table>
				</v-card-text>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn dense class="primary--btn" @click="goToListTransaksiPencucian()"> Tutup </v-btn>
				</v-card-actions>
			</v-card>
		</div>
	</v-main>
</template>

<style scoped>
.one-row {
	display: flex;
	justify-content: center;
	align-items: center;
	column-gap: 4rem;
}

.fixed-width-field {
	width: 150px;
}

.pencuci-title {
	color: #333;
	font-size: 1.4rem;
	font-weight: 700;
	letter-spacing: -0.5px;
	text-transform: capitalize;

	margin-top: 1.4rem;
	margin-bottom: 1rem;
}
</style>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			userLogin: JSON.parse(localStorage.getItem('userLogin')),
			id: this.$route.params.id,
			singleSelect: false,
			selected: [],
			kasir_list: [],
			kendaraan_list: [],
			jenis_kendaraan_list: ['Mobil', 'Motor'],
			snackbar: {
				status: false,
				color: '',
				message: '',
			},
			form: {
				no_pencucian: '',
				kendaraan_id: '',
				nama_kendaraan: '',
				tarif_kendaraan: '',
				no_polisi: '',
				jenis_kendaraan: '',
				tgl_pencucian: '',
				waktu_pencucian: '',
				karyawan_id: '',
				status: '',
				is_free: '',
				is_save_mobil_pelanggan: '',
				keuntungan: '',
				total_pembayaran: '',
				paid_at: '',
				karyawan_pencucis: [],
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
				{ title: 'Nama Pencuci', value: 'nama' },
				{ title: 'Upah Pencuci', value: 'pivot.upah_pencuci' },
			];

			this.axioData();
			this.axioKaryawanKasir();
			this.axioKendaraan();
		},
		async axioData() {
			try {
				let url = 'api/transaksi-pencucian/' + this.id;

				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.get(url, { headers });
				if (response.status == 200) {
					this.form = response.data.data;
					this.form.no_polisi = response.data.data.no_polisi ? response.data.data.no_polisi : '-';
					this.form.keuntungan = this.formatRupiah(response.data.data.keuntungan, 'Rp');
					this.form.tarif_kendaraan = this.formatRupiah(response.data.data.tarif_kendaraan, 'Rp');
					this.form.total_pembayaran = this.formatRupiah(response.data.data.total_pembayaran, 'Rp');
					this.form.tgl_pencucian = this.formatTanggal(response.data.data.tgl_pencucian);
					this.form.paid_at = response.data.data.paid_at
						? this.formatTanggal(response.data.data.paid_at)
						: '-';
					this.form.is_free = response.data.data.is_free ? 'Ya' : 'Tidak';
					this.form.is_save_mobil_pelanggan = response.data.data.is_save_mobil_pelanggan
						? 'Ya'
						: 'Tidak';
					this.list.datas = response.data.data.karyawan_pencucis;
					console.log(response.data.data);
				}
			} catch (error) {
				console.log(error);
			}
		},
		async axioKaryawanKasir() {
			try {
				let url = 'api/list-selection-kasir';

				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.get(url, { headers });
				if (response.status == 200) {
					let data = JSON.parse(JSON.stringify(response.data));
					data.forEach((item) => {
						let dashboard = item;
						dashboard.text = item.nama;
						dashboard.value = item.id;
						this.kasir_list.push(dashboard);
					});
				}
			} catch (error) {
				console.log(error);
			}
		},
		async axioKendaraan() {
			try {
				let url = 'api/list-selection-kendaraan';

				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.get(url, { headers });
				if (response.status == 200) {
					let data = JSON.parse(JSON.stringify(response.data));
					data.forEach((item) => {
						let dashboard = item;
						dashboard.title = item.nama;
						dashboard.value = item.id;
						this.kendaraan_list.push(dashboard);
					});
				}
			} catch (error) {
				console.log(error);
			}
		},
		goToListTransaksiPencucian() {
			this.$router.push('/transaksi-pencucian');
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
		formatTanggal(dateString) {
			const options = { day: 'numeric', month: 'long', year: 'numeric' };
			const date = new Date(dateString);
			return date.toLocaleDateString('id-ID', options);
		},
	},
};
</script>
