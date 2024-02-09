<template>
	<v-main>
		<v-overlay :model-value="overlay" class="align-center justify-center">
			<img src="@/assets/loading.svg" height="150" />
		</v-overlay>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Tambah Transaksi Pencucian</h1>
			</div>
			<v-stepper elevation="5" v-model="step">
				<v-stepper-header>
					<v-stepper-item
						value="1"
						color="#316291"
						:complete="step > 0"
						selected-class="stepper-item-title-active">
						<span class="stepper-item-title">Pilih Kendaraan</span>
					</v-stepper-item>
					<v-divider></v-divider>
					<v-stepper-item value="2" color="#316291" selected-class="stepper-item-title-active">
						<span class="stepper-item-title">Pilih Pencuci</span>
					</v-stepper-item>
				</v-stepper-header>
				<v-stepper-window>
					<v-stepper-window-item value="1">
						<v-card>
							<v-card-title>
								<span class="stepper-window-item-title">Silahkan isi data kendaraan</span>
							</v-card-title>
							<v-card-text>
								<div class="add-pencucian-container">
									<v-autocomplete
										:items="kendaraan_list"
										variant="underlined"
										v-model="form.kendaraan_id"
										item-value="id"
										item-title="nama"
										label="Pilih Kendaraan"></v-autocomplete>
									<v-text-field
										variant="underlined"
										v-model="form.tarif_kendaraan"
										label="Tarif Kendaraan"></v-text-field>
									<v-text-field
										variant="underlined"
										v-model="form.no_polisi"
										label="Nomor Polisi"></v-text-field>
									<div class="one-row">
										<v-text-field
											type="date"
											variant="underlined"
											v-model="form.tgl_pencucian"
											label="Tanggal"></v-text-field>
										<v-text-field
											variant="underlined"
											v-model="form.waktu_pencucian"
											:rules="timeFormatRule"
											class="fixed-width-field"
											label="Waktu (Jam:Menit:Detik)"></v-text-field>
									</div>
									<v-select
										:items="statuses"
										variant="underlined"
										v-model="form.status"
										label="Status"></v-select>
									<div class="one-row">
										<v-select
											:items="is_boolean"
											variant="underlined"
											v-model="form.is_save_mobil_pelanggan"
											item-value="value"
											item-title="title"
											class="fixed-width-field"
											label="Simpan Kendaraan Pelanggan"></v-select>
										<v-select
											:items="is_boolean"
											variant="underlined"
											v-model="form.is_free"
											item-value="value"
											item-title="title"
											class="fixed-width-field"
											label="Gratis"></v-select>
									</div>
								</div>
							</v-card-text>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn class="primary--btn" @click="step = 1">Selanjutnya</v-btn>
							</v-card-actions>
						</v-card>
					</v-stepper-window-item>
					<v-stepper-window-item value="2">
						<v-card>
							<v-card-title>
								<span class="stepper-window-item-title">Pilih pencuci kendaraan</span>
							</v-card-title>
							<v-card-text>
								<v-data-table
									v-model="list.selectedPencuci"
									:headers="list.headers"
									:items="list.datas"
									class="elevation-1"
									show-select>
									<template v-slot:no-data>
										<div color="white" class="red--text" icon="warning">
											<b>Maaf, tidak ada data tersedia.</b>
										</div>
									</template>
								</v-data-table>
							</v-card-text>
							<v-card-actions>
								<v-btn class="secondary--btn" @click="step = 0">Sebelumnya</v-btn>
								<v-spacer></v-spacer>
								<v-btn class="primary--btn" :loading="btnLoading" @click="saveData">Simpan</v-btn>
							</v-card-actions>
						</v-card>
					</v-stepper-window-item>
				</v-stepper-window>
			</v-stepper>

			<base-snackbar
				v-model="snackbar.status"
				:color="snackbar.color"
				:message="snackbar.message"></base-snackbar>
		</div>
	</v-main>
</template>

<style>
.one-row {
	display: flex;
	column-gap: 4rem;
}

.fixed-width-field {
	width: 150px;
}

.fixed-width-field .v-messages_message {
	width: 100%;
}

.stepper-item-title {
	font-size: 1rem;
	font-weight: 700;
	letter-spacing: -0.1px;
}

.stepper-item-title-active {
	color: #316291;
}

.stepper-window-item-title {
	font-size: 1.3rem;
	font-weight: 700;
	letter-spacing: -0.5px;
	color: #333;
}
</style>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			step: 0,
			userLogin: JSON.parse(localStorage.getItem('userLogin')),
			form: {
				kendaraan_id: '',
				nama_kendaraan: '',
				tarif_kendaraan: '',
				no_polisi: '',
				jenis_kendaraan: '',
				tgl_pencucian: new Date().toISOString().substr(0, 10),
				waktu_pencucian: '',
				status: 'Lunas',
				is_save_mobil_pelanggan: false,
				is_free: false,
				detail_transaksi_pencuci: [],
			},
			list: {
				search: '',
				headers: [{ title: 'Nama Karyawan', value: 'nama' }],
				datas: [],
				selectedPencuci: [],
			},
			timeFormatRule: [
				(v) =>
					/^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(v) ||
					'Format waktu tidak valid (00:00:00)',
			],
			snackbar: {
				status: false,
				message: '',
				color: '',
			},
			overlay: true,
			kendaraan_list: [],
			statuses: ['Belum Bayar', 'Lunas'],
			is_boolean: [
				{ title: 'Tidak', value: false },
				{ title: 'Ya', value: true },
			],
			btnLoading: false,
		};
	},
	created() {
		this.initialize();
	},
	methods: {
		initialize() {
			this.overlay = true;
			this.axioKendaraan();
			this.axioKaryawanPencuci();
			this.setToCurrentTime();

			setTimeout(() => {
				this.overlay = false;
			}, 300);
		},
		setToCurrentTime() {
			const currentTime = new Date();
			const hours = String(currentTime.getHours()).padStart(2, '0');
			const minutes = String(currentTime.getMinutes()).padStart(2, '0');
			const seconds = String(currentTime.getSeconds()).padStart(2, '0');

			this.form.waktu_pencucian = `${hours}:${minutes}:${seconds}`;
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
						dashboard.text = item.nama;
						dashboard.value = item.id;
						this.kendaraan_list.push(dashboard);
					});
				}
			} catch (error) {
				console.log(error);
			}
		},
		async axioKaryawanPencuci() {
			try {
				let url = 'api/list-selection-pencuci';

				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.get(url, { headers });
				if (response.status == 200) {
					this.list.datas = response.data;
				}
			} catch (error) {
				console.log(error);
			}
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
		async saveData() {
			try {
				this.btnLoading = true;

				this.form.detail_transaksi_pencuci = [];
				this.list.selectedPencuci.forEach((x) => {
					let d = {};
					d.karyawan_id = x;
					this.form.detail_transaksi_pencuci.push(d);
				});

				let data = {
					kendaraan_id: this.form.kendaraan_id,
					no_polisi: this.form.no_polisi,
					jenis_kendaraan: this.form.jenis_kendaraan,
					tarif_kendaraan: this.form.tarif_kendaraan,
					tgl_pencucian: this.form.tgl_pencucian,
					waktu_pencucian: this.form.waktu_pencucian,
					status: this.form.status,
					is_free: this.form.is_free,
					is_save_mobil_pelanggan: this.form.is_save_mobil_pelanggan,
					detail_transaksi_pencuci: this.form.detail_transaksi_pencuci,
				};

				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				var url = 'api/transaksi-pencucian';

				const response = await axios.post(url, data, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;

					setTimeout(() => {
						this.goToListTransaksiPencucian();
					}, 500);
				}
			} catch (error) {
				console.log(error);
				this.snackbar.message = error.response.data.message;
				this.snackbar.color = 'red';
				this.snackbar.status = true;
				this.btnLoading = false;
			}
		},
		goToListTransaksiPencucian() {
			this.$router.push('/transaksi-pencucian');
		},
	},
	watch: {
		'form.kendaraan_id'(val) {
			let index = this.kendaraan_list.findIndex((obj) => obj.id === val);
			this.form.tarif_kendaraan = this.kendaraan_list[index].harga;
			this.form.jenis_kendaraan = this.kendaraan_list[index].tipe;
		},
	},
};
</script>
