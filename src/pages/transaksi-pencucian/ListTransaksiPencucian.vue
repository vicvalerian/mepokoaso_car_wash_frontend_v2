<template>
	<v-main>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Transaksi Pencucian</h1>
				<v-btn rounded="sm" elevation="0" class="primary--btn" @click="goToAddPage()">
					Tambah Data
				</v-btn>
			</div>
			<v-card>
				<v-tabs v-model="tab" color="#316291">
					<v-tab v-for="status in statuses" :key="status"
						><span class="tab-title">{{ status }}</span></v-tab
					>
				</v-tabs>
				<base-table
					:list="list"
					@update:currentPage="goToPage"
					@update:rowsPerPage="setRowPerPage"
					@action-click="handleActionClick"
					@xSearch="xSearch"></base-table>
			</v-card>

			<v-dialog v-model="dialogDelete" persistent max-width="400px">
				<v-card>
					<v-card-title class="dialog-confirm-title">
						<span class="headline white--text">Hapus Data Transaksi Pencucian</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<span>Apakah Anda yakin ingin menghapus data transaksi pencucian ini?</span>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn dense class="secondary--btn" @click="dialogDelete = false">Batal</v-btn>
						<v-btn dense class="primary--btn" :loading="btnLoading" @click="deleteData()"
							>Hapus</v-btn
						>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<v-dialog v-model="dialogConfirmCetakNota" persistent max-width="450px">
				<v-card>
					<v-card-title class="dialog-confirm-title">
						<span class="headline white--text">Cetak Nota {{ nota.no_pencucian }}</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<span>Apakah anda yakin ingin mencetak nota transaksi pencucian ini?</span>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn dense class="secondary--btn" @click="cancelCetakNota()">Batal</v-btn>
						<v-btn dense class="primary--btn" :loading="btnLoading" @click="cetakNota()"
							>Cetak</v-btn
						>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<v-dialog v-model="dialogConfirmUbahStatus" persistent max-width="450px">
				<v-card>
					<v-card-title class="dialog-confirm-title">
						<span class="headline white--text">Pelunasan {{ changeStatus.no_pencucian }}</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<span>Apakah anda yakin ingin mengubah status transaksi pencucian menjadi lunas?</span>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn dense class="secondary--btn" @click="cancelUbahStatus()">Batal</v-btn>
						<v-btn dense class="primary--btn" :loading="btnLoading" @click="updateStatusProses()"
							>Ubah</v-btn
						>
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

<style scoped>
.tab-title {
	text-transform: capitalize;
	font-weight: 700;
	font-size: 1rem;
	letter-spacing: -0.1px;
}
</style>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			userLogin: JSON.parse(localStorage.getItem('userLogin')),
			formTitle: 'Tambah',
			list: {
				headers: [
					{ title: 'No', value: 'nomor', width: '5%', type: 'number' },
					{ title: 'No Transaksi', value: 'no_pencucian', sortable: true },
					{ title: 'Kendaraan', value: 'kendaraan.nama', sortable: true, type: 'nested' },
					{ title: 'Nomor Plat', value: 'no_polisi', sortable: true },
					{ title: 'Tanggal', value: 'tgl_pencucian', sortable: true, type: 'date' },
					{ title: 'Gratis', value: 'is_free', sortable: true, type: 'boolean' },
					{ title: 'Total Pembayaran', value: 'total_pembayaran', sortable: true, type: 'rupiah' },
					{ title: 'Pencuci', value: 'karyawan_pencucis', sortable: false, type: 'pencuci' },
					{ title: 'Status', value: 'status', sortable: true, type: 'status' },
					{ title: 'Aksi', value: 'actions', type: 'actions', sortable: false },
				],
				datas: [],
				loading: true,
				paginate: {
					rowsPerPage: 10,
					currentPage: 1,
				},
			},
			editId: '',
			deleteId: '',
			form: {
				nama: '',
			},
			dialogDelete: false,
			dialogConfirmCetakNota: false,
			dialogConfirmUbahStatus: false,
			snackbar: {
				status: false,
				message: '',
				color: '',
			},
			btnLoading: false,
			tab: null,
			statuses: ['Semua', 'Belum Bayar', 'Lunas'],
			selected_status: '',
			nota: {
				id: '',
				no_pencucian: '',
			},
			changeStatus: {
				id: '',
				no_pencucian: '',
			},
		};
	},
	created() {
		let url = `api/transaksi-pencucian?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}&status=${this.selected_status}`;
		this.fetchDataFromServer(url);
	},
	methods: {
		async fetchDataFromServer(url) {
			this.list.loading = true;
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.get(url, { headers });
				if (response.status == 200) {
					const data = await response.data;

					// this.list.datas = data.data;
					this.list.datas = this.addActionsToData(data.data);

					this.list.totalDatas = data.total;

					this.list.paginate.rowsPerPage = parseInt(data.per_page);
					this.list.paginate.total = data.total;
					this.list.paginate.from = data.from;
					this.list.paginate.to = data.to;
					this.list.paginate.lastPage = data.last_page;
					this.list.paginate.currentPage = parseInt(data.current_page);
					this.list.paginate.firstPageUrl = data.first_page_url;
					this.list.paginate.lastPageUrl = data.last_page_url;
					this.list.paginate.prevPageUrl = data.prev_page_url;
					this.list.paginate.nextPageUrl = data.next_page_url;
					this.list.paginate.goToPage = this.goToPage;
				}

				this.list.loading = false;
			} catch (error) {
				console.log(error);
			}
		},
		setRowPerPage(val = 10) {
			let url = `api/transaksi-pencucian?per_page=${val}&page=1&status=${this.selected_status}`;
			this.fetchDataFromServer(url);
		},
		goToPage(val = 0) {
			let url = `api/transaksi-pencucian?per_page=${this.list.paginate.rowsPerPage}&page=${val}&status=${this.selected_status}`;
			this.fetchDataFromServer(url);
		},
		addActionsToData(data) {
			return data.map((item) => {
				let actions = [];

				switch (item.status) {
					case 'Belum Bayar':
						actions = [
							{ title: 'Lihat Detail', icon: 'mdi-information' },
							{ title: 'Ubah', icon: 'mdi-pencil' },
							{ title: 'Hapus', icon: 'mdi-delete' },
							{ title: 'Pembayaran', icon: 'mdi-cash-check' },
						];
						break;
					case 'Lunas':
						actions = [
							{ title: 'Lihat Detail', icon: 'mdi-information' },
							{ title: 'Ubah', icon: 'mdi-pencil' },
							{ title: 'Hapus', icon: 'mdi-delete' },
							{ title: 'Cetak Nota', icon: 'mdi-download' },
						];
						break;
					default:
						actions = [
							{ title: 'Lihat Detail', icon: 'mdi-information' },
							{ title: 'Ubah', icon: 'mdi-pencil' },
							{ title: 'Hapus', icon: 'mdi-delete' },
						];
						break;
				}

				return {
					...item,
					actions: actions,
				};
			});
		},
		handleActionClick({ action, item }) {
			switch (action.title) {
				case 'Lihat Detail':
					this.$router.push(`transaksi-pencucian/detail/${item.uuid}`);
					break;

				case 'Ubah':
					this.$router.push(`transaksi-pencucian/ubah/${item.uuid}`);
					break;

				case 'Hapus':
					this.deleteId = item.uuid;
					this.dialogDelete = true;
					break;

				case 'Pembayaran':
					this.changeStatus.id = item.uuid;
					this.changeStatus.no_pencucian = item.no_pencucian;
					this.dialogConfirmUbahStatus = true;
					break;

				case 'Cetak Nota':
					this.nota.id = item.uuid;
					this.nota.no_pencucian = item.no_pencucian;
					this.dialogConfirmCetakNota = true;
					break;

				default:
					break;
			}
		},
		xSearch({ query }) {
			if (query.length > 2 || query.length == 0) {
				let url = `api/transaksi-pencucian?per_page=10&page=1&keyword=${query}&status=${this.selected_status}`;
				this.fetchDataFromServer(url);
			} else {
				this.snackbar.status = true;
				this.snackbar.color = 'red';
				this.snackbar.message = 'Harap masukkan minimal 3 kata pencarian!';
			}
		},
		async deleteData() {
			this.btnLoading = true;

			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let deleteUrl = 'api/transaksi-pencucian/' + this.deleteId;
				const response = await axios.delete(deleteUrl, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogDelete = false;

					//fetch new data
					let url = `api/transaksi-pencucian?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
					this.fetchDataFromServer(url);
				}
			} catch (error) {
				this.snackbar.message = error.response.data.message;
				this.snackbar.color = 'red';
				this.snackbar.status = true;
				this.btnLoading = false;
				this.dialogDelete = false;
			}
		},
		cancelCetakNota() {
			this.nota.id = '';
			this.nota.no_pencucian = '';
			this.dialogConfirmCetakNota = false;
		},
		async cetakNota() {
			try {
				this.btnLoading = true;

				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				var url = 'api/transaksi-pencucian/nota/' + this.nota.id;
				const response = await axios.get(url, { headers, responseType: 'arraybuffer' });
				console.log(response);
				if (response.status == 200) {
					let blob = new Blob([response.data], { type: 'application/pdf' });
					let link = document.createElement('a');
					link.href = window.URL.createObjectURL(blob);
					link.download = 'Nota Pencucian ' + this.nota.no_pencucian + '.pdf';
					link.click();
					this.btnLoading = false;
					this.dialogConfirmCetakNota = false;
				}
			} catch (error) {
				console.log(error);
				this.btnLoading = false;
			}
		},
		async updateStatusProses() {
			try {
				this.btnLoading = true;

				let data = {
					id: this.changeStatus.id,
				};

				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				var url = 'api/transaksi-pencucian/finish';
				const response = await axios.put(url, data, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.dialogConfirmUbahStatus = false;
					this.btnLoading = false;

					let refreshUrl = `api/transaksi-pencucian?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}&status=${this.selected_status}`;
					this.fetchDataFromServer(refreshUrl);
				}
			} catch (error) {
				this.snackbar.message = error.response.data.message;
				this.snackbar.color = 'red';
				this.snackbar.status = true;
				this.btnLoading = false;
				this.dialogConfirmUbahStatus = false;
			}
		},
		cancelUbahStatus() {
			this.changeStatus.id = '';
			this.changeStatus.no_pencucian = '';
			this.dialogConfirmUbahStatus = false;
		},
		goToAddPage() {
			this.$router.push(`transaksi-pencucian/tambah`);
		},
	},
	watch: {
		tab(val) {
			if (val === 0) {
				this.selected_status = '';
			} else {
				this.selected_status = this.statuses[val];
			}

			let url = `api/transaksi-pencucian?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}&status=${this.selected_status}`;
			this.fetchDataFromServer(url);
		},
	},
};
</script>
