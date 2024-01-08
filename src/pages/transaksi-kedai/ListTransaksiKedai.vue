<template>
	<v-main>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Transaksi Kedai</h1>
				<v-btn rounded="sm" elevation="0" class="primary--btn" @click="goToAddPage()">
					Tambah Data
				</v-btn>
			</div>
			<v-card>
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
						<span class="headline white--text">Hapus Data Transaksi Kedai</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<span>Apakah Anda yakin ingin menghapus data transaksi kedai ini?</span>
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

			<base-snackbar
				v-model="snackbar.status"
				:color="snackbar.color"
				:message="snackbar.message"></base-snackbar>
		</div>
	</v-main>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			userLogin: JSON.parse(localStorage.getItem('userLogin')),
			list: {
				headers: [
					{ title: 'No', value: 'nomor', width: '5%', type: 'number' },
					{ title: 'No Penjualan', value: 'no_penjualan', sortable: true },
					{ title: 'Tanggal', value: 'tgl_penjualan', sortable: true, type: 'date' },
					{ title: 'Pelayan', value: 'karyawan.nama', sortable: true, type: 'nested' },
					{ title: 'Total', value: 'total_penjualan', sortable: true, type: 'rupiah' },
					{ title: 'Aksi', value: 'actions', type: 'actions', sortable: false },
				],
				datas: [],
				loading: true,
				paginate: {
					rowsPerPage: 10,
					currentPage: 1,
				},
			},
			deleteId: '',
			dialogDelete: false,
			snackbar: {
				status: false,
				message: '',
				color: '',
			},
			btnLoading: false,
		};
	},
	created() {
		let url = `api/transaksi-kedai?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
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
			let url = `api/transaksi-kedai?per_page=${val}&page=1`;
			this.fetchDataFromServer(url);
		},
		goToPage(val = 0) {
			let url = `api/transaksi-kedai?per_page=${this.list.paginate.rowsPerPage}&page=${val}`;
			this.fetchDataFromServer(url);
		},
		addActionsToData(data) {
			return data.map((item) => ({
				...item,
				actions: [
					{ title: 'Lihat Detail', icon: 'mdi-information' },
					{ title: 'Ubah', icon: 'mdi-pencil' },
					{ title: 'Hapus', icon: 'mdi-delete' },
				],
			}));
		},
		handleActionClick({ action, item }) {
			switch (action.title) {
				case 'Lihat Detail':
					this.$router.push(`transaksi-kedai/detail/${item.uuid}`);
					break;

				case 'Ubah':
				this.$router.push(`transaksi-kedai/ubah/${item.uuid}`);
					break;

				case 'Hapus':
					this.deleteId = item.uuid;
					this.dialogDelete = true;
					break;

				default:
					break;
			}
		},
		xSearch({ query }) {
			if (query.length > 2 || query.length == 0) {
				let url = `api/transaksi-kedai?per_page=10&page=1&keyword=${query}`;
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

				let deleteUrl = 'api/transaksi-kedai/' + this.deleteId;
				const response = await axios.delete(deleteUrl, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogDelete = false;

					//fetch new data
					let url = `api/transaksi-kedai?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
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
		goToAddPage() {
			this.$router.push(`transaksi-kedai/tambah`);
		},
	},
};
</script>
