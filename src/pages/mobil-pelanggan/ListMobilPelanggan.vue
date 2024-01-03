<template>
	<v-main>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Mobil Pelanggan</h1>
			</div>
			<v-card>
				<base-table
					:list="list"
					@update:currentPage="goToPage"
					@update:rowsPerPage="setRowPerPage"
					@action-click="handleActionClick"
					@xSearch="xSearch"></base-table>
			</v-card>

			<v-dialog v-model="dialogDetail" persistent max-width="800px">
				<v-card>
					<v-card-title class="dialog-confirm-title">
						<span class="headline white--text">Detail Transaksi Pencucian Mobil Pelanggan</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-content">
						<v-container fluid>
							<div>
								<div>
									<v-data-table
										:headers="formDetail.headers"
										:items="formDetail.datas"
										class="elevation-1">
										<template v-slot:[`item.nomor_detail`]="{ item }">
											<span>{{ formDetail.datas.indexOf(item) + 1 }}</span>
										</template>
										<template v-slot:[`item.tgl_pencucian`]="{ item }">
											<span>{{ formatTanggal(item.tgl_pencucian) }}</span>
										</template>
										<template v-slot:no-data>
											<div color="white" class="red--text" icon="warning">
												<b>Maaf, tidak ada data tersedia.</b>
											</div>
										</template>
									</v-data-table>
								</div>
							</div>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn dense color="btn-confirm-cancel" @click="dialogDetail = false">Tutup</v-btn>
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
					{ title: 'Nama Kendaraan', value: 'nama_kendaraan', sortable: true },
					{ title: 'Nomor Plat Kendaraan', value: 'no_polisi', sortable: true },
					{ title: 'Aksi', value: 'actions', type: 'actions', sortable: false, width: '30%' },
				],
				datas: [],
				loading: true,
				paginate: {
					rowsPerPage: 10,
					currentPage: 1,
				},
			},
			dialogDetail: false,
			snackbar: {
				status: false,
				message: '',
				color: '',
			},
			searchId: '',
			formDetail: {
				headers: [
					{ title: 'No', value: 'nomor_detail' },
					{ title: 'Status', value: 'status' },
					{ title: 'Tanggal Pencucian', value: 'tgl_pencucian' },
					{ title: 'Waktu Pencucian', value: 'waktu_pencucian' },
				],
				datas: [],
			},
		};
	},
	created() {
		let url = `api/mobil-pelanggan?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
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
			let url = `api/mobil-pelanggan?per_page=${val}&page=1`;
			this.fetchDataFromServer(url);
		},
		goToPage(val = 0) {
			let url = `api/mobil-pelanggan?per_page=${this.list.paginate.rowsPerPage}&page=${val}`;
			this.fetchDataFromServer(url);
		},
		addActionsToData(data) {
			return data.map((item) => ({
				...item,
				actions: [{ title: 'Riwayat Pencucian', icon: 'mdi-history' }],
			}));
		},
		handleActionClick({ action, item }) {
			switch (action.title) {
				case 'Riwayat Pencucian':
					this.searchId = item.id;
					this.getRiwayatPencucian();
					this.dialogDetail = true;

					break;

				default:
					break;
			}
		},
		xSearch({ query }) {
			if (query.length > 2 || query.length == 0) {
				let url = `api/mobil-pelanggan?per_page=10&page=1&keyword=${query}`;
				this.fetchDataFromServer(url);
			} else {
				this.snackbar.status = true;
				this.snackbar.color = 'red';
				this.snackbar.message = 'Harap masukkan minimal 3 kata pencarian!';
			}
		},
		async getRiwayatPencucian() {
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let url = 'api/mobil-pelanggan-transaksi/' + this.searchId;

				const response = await axios.get(url, { headers });
				if (response.status == 200) {
					this.formDetail.datas = response.data;
					console.log(response.data);
				}
			} catch (error) {
				console.log(error);
			}
		},
		formatTanggal(dateString) {
			const options = { day: 'numeric', month: 'long', year: 'numeric' };
			const date = new Date(dateString);
			return date.toLocaleDateString('id-ID', options);
		},
	},
};
</script>
