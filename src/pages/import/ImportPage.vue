<template>
	<v-main>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Impor Dokumen</h1>
			</div>
			<v-card elevation="4" class="mb-4">
				<v-card-text>
					<div class="report-card-container">
						<p class="report-card-title">Transaksi Pencucian Kendaraan</p>
						<div class="report-date-container">
							<v-file-input
								accept=".xlsx"
								label="Pilih dokumen spreadsheet"
								id="transaksiPencucianDoc"
								variant="underlined"></v-file-input>
						</div>
						<div class="report-btn-container">
							<v-btn
								class="primary--btn flex-full-width"
								@click="openDialogConfirmImport('transaksi-pencucian', 'transaksiPencucianDoc')">
								Impor
							</v-btn>
							<v-btn
								class="secondary--btn flex-full-width"
								:loading="btnLoadingSampelPencucian"
								@click="konfirmasiSampel('PENCUCIAN')">
								Unduh Sampel
							</v-btn>
						</div>
					</div>
				</v-card-text>
			</v-card>
			<v-card elevation="4" class="mb-4">
				<v-card-text>
					<div class="report-card-container">
						<p class="report-card-title">Pembelanjaan Harian</p>
						<div class="report-date-container">
							<v-file-input
								accept=".xlsx"
								label="Pilih dokumen spreadsheet"
								id="pembelanjaanHarianDoc"
								variant="underlined"></v-file-input>
						</div>
						<div class="report-btn-container">
							<v-btn
								class="primary--btn flex-full-width"
								@click="openDialogConfirmImport('pembelanjaan-harian', 'pembelanjaanHarianDoc')">
								Impor
							</v-btn>
							<v-btn
								class="secondary--btn flex-full-width"
								:loading="btnLoadingSampelPencucian"
								@click="konfirmasiSampel('PEMBELANJAANHARIAN')">
								Unduh Sampel
							</v-btn>
						</div>
					</div>
				</v-card-text>
			</v-card>

			<v-dialog v-model="dialogConfirmImport" persistent max-width="450px">
				<v-card>
					<v-card-title class="dialog-confirm-title">
						<span class="headline white--text">Impor Dokumen</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<span>Proses ini membutuhkan waktu sedikit lama, yakin untuk mengimpor?</span>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn dense class="secondary--btn" @click="dialogConfirmImport = false">Batal</v-btn>
						<v-btn
							dense
							class="primary--btn"
							:loading="btnLoadingConfirmImport"
							@click="konfirmasiImport()">
							Impor
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

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

	font-size: 1.1rem;
	font-weight: 700;
	letter-spacing: -0.1px;
}
.report-date-container {
	display: flex;
	align-items: center;
	justify-content: center;
	column-gap: 1rem;
}

.report-btn-container {
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	row-gap: 1rem;
}

.flex-full-width {
	width: 100%;
}
</style>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			baseUrl: 'http://127.0.0.1:8000/',
			userLogin: JSON.parse(localStorage.getItem('userLogin')),
			dialogConfirmImport: false,
			btnLoadingSampelPencucian: false,
			btnLoadingSampelPembelanjaanHarian: false,
			btnLoadingConfirmImport: false,
			importTypeUrl: '',
			importDocId: '',
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
		async konfirmasiSampel(type) {
			try {
				var url = 'api/import/document-sample?type_doc=' + type;

				const response = await axios.get(url);
				if (response.status == 200) {
					this.cancelLoading();
					window.open(this.baseUrl + url, '_new');
				}
			} catch (error) {
				this.snackbar.message = error.response.data.message;
				this.snackbar.color = 'red';
				this.snackbar.status = true;
			}
		},
		openDialogConfirmImport(type, id) {
			this.importTypeUrl = type;
			this.importDocId = id;

			var import_doc = document.getElementById(id),
				importDataDoc = import_doc.files[0];

			if (!importDataDoc) {
				this.snackbar.message =
					'Spreadsheet tidak boleh kosong, pilih spreadsheet terlebih dahulu!';
				this.snackbar.color = 'red';
				this.snackbar.status = true;
			} else {
				this.dialogConfirmImport = true;
			}
		},
		async konfirmasiImport() {
			this.btnLoadingConfirmImport = true;
			var import_doc = document.getElementById(this.importDocId),
				importDataDoc = import_doc.files[0];

			var data = new FormData();
			data.append('csv', importDataDoc);

			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let url = 'api/import/' + this.importTypeUrl;
				const response = await axios.post(url, data, { headers });
				if (response.status == 200) {
					this.snackbar.message = 'Impor berhasil!';
					this.snackbar.color = 'green';
					this.snackbar.status = true;

					this.cancelLoading();
					this.resetImport();
					this.dialogConfirmImport = false;
				}
			} catch (error) {
				this.snackbar.message = 'Impor gagal! Silahkan periksa kembali spreadsheet Anda';
				this.snackbar.color = 'red';
				this.snackbar.status = true;
				this.cancelLoading();
				this.resetImport();
				this.dialogConfirmImport = false;
			}
		},
		cancelLoading() {
			this.btnLoadingSampelPencucian = false;
			this.btnLoadingSampelPembelanjaanHarian = false;
			this.btnLoadingConfirmImport = false;
		},
		resetImport() {
			this.importTypeUrl = '';
			this.importDocId = '';
		},
	},
};
</script>
