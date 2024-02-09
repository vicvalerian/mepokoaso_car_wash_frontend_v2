<template>
	<v-main>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Laporan</h1>
			</div>
			<v-card elevation="4" class="mb-4">
				<v-card-text>
					<div class="report-card-container">
						<p class="report-card-title">Laporan Pendapatan Pencucian Kendaraan</p>
						<div class="report-date-container">
							<v-text-field
								type="date"
								v-model="tglMulaiPendapatanPencucian"
								label="Tanggal Mulai"
								variant="underlined"
								hide-details
								required></v-text-field>
							<v-text-field
								type="date"
								v-model="tglSelesaiPendapatanPencucian"
								label="Tanggal Selesai"
								variant="underlined"
								hide-details
								required></v-text-field>
						</div>
						<v-btn
							class="primary--btn"
							:loading="btnLoadingPendapatanPencucian"
							@click="
								konfirmasiHandler(
									`transaksi-pencucian?tglMulai=${tglMulaiPendapatanPencucian}&tglSelesai=${tglSelesaiPendapatanPencucian}`,
									'Pendapatan Pencucian Kendaraan',
									tglMulaiPendapatanPencucian,
									tglSelesaiPendapatanPencucian
								)
							">
							Unduh
						</v-btn>
					</div>
				</v-card-text>
			</v-card>
			<v-card elevation="4" class="mb-4">
				<v-card-text>
					<div class="report-card-container">
						<p class="report-card-title">Laporan Pendapatan Penjualan Kedai</p>
						<div class="report-date-container">
							<v-text-field
								type="date"
								v-model="tglMulaiPendapatanKedai"
								label="Tanggal Mulai"
								variant="underlined"
								hide-details
								required></v-text-field>
							<v-text-field
								type="date"
								v-model="tglSelesaiPendapatanKedai"
								label="Tanggal Selesai"
								variant="underlined"
								hide-details
								required></v-text-field>
						</div>
						<v-btn
							class="primary--btn"
							:loading="btnLoadingPendapatanKedai"
							@click="
								konfirmasiHandler(
									`transaksi-kedai?tglMulai=${tglMulaiPendapatanKedai}&tglSelesai=${tglSelesaiPendapatanKedai}`,
									'Pendapatan Penjualan Kedai',
									tglMulaiPendapatanKedai,
									tglSelesaiPendapatanKedai
								)
							"
							>Unduh</v-btn
						>
					</div>
				</v-card-text>
			</v-card>
			<v-card elevation="4" class="mb-4">
				<v-card-text>
					<div class="report-card-container">
						<p class="report-card-title">Laporan Pendapatan Pengeluaran Kedai</p>
						<div class="report-date-container">
							<v-text-field
								type="date"
								v-model="tglMulaiPengeluaranKedai"
								label="Tanggal Mulai"
								variant="underlined"
								hide-details
								required></v-text-field>
							<v-text-field
								type="date"
								v-model="tglSelesaiPengeluaranKedai"
								label="Tanggal Selesai"
								variant="underlined"
								hide-details
								required></v-text-field>
						</div>
						<v-btn
							class="primary--btn"
							:loading="btnLoadingPengeluaranKedai"
							@click="
								konfirmasiHandler(
									`pengeluaran-kedai?tglMulai=${tglMulaiPengeluaranKedai}&tglSelesai=${tglSelesaiPengeluaranKedai}`,
									'Pengeluaran Kedai',
									tglMulaiPengeluaranKedai,
									tglSelesaiPengeluaranKedai
								)
							"
							>Unduh</v-btn
						>
					</div>
				</v-card-text>
			</v-card>
			<v-card elevation="4" class="mb-4">
				<v-card-text>
					<div class="report-card-container-v2">
						<p class="report-card-title">Laporan Pemasukan dan Pengeluaran Harian</p>
						<div class="report-date-container">
							<v-text-field
								type="date"
								v-model="tglPemasukanPengeluaranHarian"
								label="Tanggal Mulai"
								variant="underlined"
								hide-details
								required></v-text-field>
						</div>
						<v-btn
							class="primary--btn"
							:loading="btnLoadingPemasukanPengeluaranHarian"
							@click="
								konfirmasiHandler(
									`pemasukan-pengeluaran-harian?tglMulai=${tglPemasukanPengeluaranHarian}`,
									'Pemasukan Pengeluaran Harian',
									tglPemasukanPengeluaranHarian,
									null
								)
							"
							>Unduh</v-btn
						>
					</div>
				</v-card-text>
			</v-card>

			<base-snackbar
				v-model="snackbar.status"
				:color="snackbar.color"
				:message="snackbar.message"></base-snackbar>
		</div>
	</v-main>
</template>

<style>
.report-card-container {
	display: grid;
	grid-template-columns: 2fr 2fr 1fr;
	column-gap: 4rem;

	align-items: center;

	padding: 8px;
}

.report-card-container-v2 {
	display: grid;
	grid-template-columns: 3fr 1fr 1fr;
	column-gap: 4rem;

	align-items: center;

	padding: 8px;
}

.report-card-title {
	display: flex;
	justify-content: flex-start;
	align-items: center;

	font-size: 1rem;
	font-weight: 700;
	letter-spacing: -0.1px;
}
.report-date-container {
	display: flex;
	align-items: center;
	justify-content: center;
	column-gap: 1rem;
}
</style>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			userLogin: JSON.parse(localStorage.getItem('userLogin')),
			tglMulaiPendapatanPencucian: new Date().toISOString().substr(0, 10),
			tglSelesaiPendapatanPencucian: new Date().toISOString().substr(0, 10),
			tglMulaiPendapatanKedai: new Date().toISOString().substr(0, 10),
			tglSelesaiPendapatanKedai: new Date().toISOString().substr(0, 10),
			tglMulaiPengeluaranKedai: new Date().toISOString().substr(0, 10),
			tglSelesaiPengeluaranKedai: new Date().toISOString().substr(0, 10),
			tglPemasukanPengeluaranHarian: new Date().toISOString().substr(0, 10),
			btnLoadingPendapatanPencucian: false,
			btnLoadingPendapatanKedai: false,
			btnLoadingPengeluaranKedai: false,
			btnLoadingPemasukanPengeluaranHarian: false,
			snackbar: {
				status: false,
				color: '',
				message: '',
			},
			path: '',
			documentName: '',
		};
	},
	methods: {
		konfirmasiHandler(path, name, dateStart, dateEnd) {
			this.path = path;
			this.documentName = name;

			this.exportLaporan(name, dateStart, dateEnd);
		},
		async exportLaporan(name, dateStart, dateEnd) {
			try {
				switch (name) {
					case 'Pendapatan Pencucian Kendaraan':
						this.btnLoadingPendapatanPencucian = true;
						break;

					case 'Pendapatan Penjualan Kedai':
						this.btnLoadingPendapatanKedai = true;
						break;

					case 'Pengeluaran Kedai':
						this.btnLoadingPengeluaranKedai = true;
						break;

					case 'Pemasukan Pengeluaran Harian':
						this.btnLoadingPemasukanPengeluaranHarian = true;
						break;

					default:
						break;
				}

				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				var url = 'api/laporan/' + this.path;

				const response = await axios.get(url, { headers, responseType: 'arraybuffer' });
				if (response.status == 200) {
					this.cancelLoading();
					let blob = new Blob([response.data], { type: 'application/pdf' });
					let link = document.createElement('a');
					link.href = window.URL.createObjectURL(blob);
					link.download =
						dateEnd != null
							? 'Laporan ' + this.documentName + ' ' + dateStart + ' - ' + dateEnd + '.pdf'
							: 'Laporan ' + this.documentName + ' ' + dateStart + '.pdf';
					link.click();
				}
			} catch (error) {
				this.snackbar.message = error.response.data.message;
				this.snackbar.color = 'red';
				this.snackbar.status = true;
				this.dialogKonfirmasi = false;
			}
		},
		cancelLoading() {
			this.btnLoadingPendapatanPencucian = false;
			this.btnLoadingPendapatanKedai = false;
			this.btnLoadingPengeluaranKedai = false;
			this.btnLoadingPemasukanPengeluaranHarian = false;
		},
	},
};
</script>
