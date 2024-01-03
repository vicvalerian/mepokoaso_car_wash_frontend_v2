<template>
	<v-main>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Peminjaman Karyawan</h1>
				<v-btn rounded="sm" elevation="0" class="primary--btn" @click="dialogAddEdit = true">
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

			<v-dialog v-model="dialogAddEdit" persistent max-width="600px">
				<v-card>
					<v-card-title class="dialog-confirm-title">
						<span class="headline white--text">{{ formTitle }} Data Peminjaman Karyawan</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<v-container v-if="formTitle == 'Tambah'">
							<v-autocomplete
								:items="karyawan_list"
								v-model="form.karyawan_id"
								label="Nama Karyawan"
								item-value="id"
								item-title="nama"
								variant="underlined"
								required></v-autocomplete>
							<v-text-field
								type="date"
								v-model="form.tgl_peminjaman"
								label="Tanggal Peminjaman"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.nominal"
								label="Nominal Peminjaman"
								variant="underlined"
								required></v-text-field>
							<v-textarea
								v-model="form.alasan"
								label="Alasan Peminjaman"
								auto-grow
								variant="underlined"></v-textarea>
						</v-container>
						<v-container v-else>
							<v-autocomplete
								:items="karyawan_list"
								v-model="form.karyawan_id"
								label="Nama Karyawan"
								item-value="id"
								item-title="nama"
								variant="underlined"
								required></v-autocomplete>
							<v-text-field
								type="date"
								v-model="form.tgl_peminjaman"
								label="Tanggal Peminjaman"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.nominal"
								label="Nominal Peminjaman"
								variant="underlined"
								required></v-text-field>
							<v-textarea
								v-model="form.alasan"
								label="Alasan Peminjaman"
								auto-grow
								variant="underlined"></v-textarea>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn dense class="secondary--btn" variant="outlined" @click="cancelForm()"
							>Batal</v-btn
						>
						<v-btn dense class="primary--btn" :loading="btnLoading" @click="submitForm()"
							>Simpan</v-btn
						>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<v-dialog v-model="dialogDelete" persistent max-width="400px">
				<v-card>
					<v-card-title class="dialog-confirm-title">
						<span class="headline white--text">Hapus Data Peminjaman Karyawan</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<span>Apakah Anda yakin ingin menghapus data peminjaman karyawan ini?</span>
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
			formTitle: 'Tambah',
			list: {
				headers: [
					{ title: 'No', value: 'nomor', width: '5%', type: 'number' },
					{ title: 'Nama Karyawan', value: 'karyawan.nama', sortable: true, type: 'nested' },
					{ title: 'Tanggal Peminjaman', value: 'tgl_peminjaman', sortable: true, type: 'date' },
					{ title: 'Nominal', value: 'nominal', sortable: true, type: 'rupiah' },
					{ title: 'Aksi', value: 'actions', type: 'actions', sortable: false },
				],
				datas: [],
				loading: true,
				paginate: {
					rowsPerPage: 10,
					currentPage: 1,
				},
			},
			peminjamanKaryawan: new FormData(),
			editId: '',
			deleteId: '',
			form: {
				karyawan_id: '',
				tgl_peminjaman: new Date().toISOString().substr(0, 10),
				nominal: '',
				alasan: '',
			},
			dialogAddEdit: false,
			dialogDelete: false,
			dateModal: false,
			snackbar: {
				status: false,
				message: '',
				color: '',
			},
			btnLoading: false,
			karyawan_list: [],
		};
	},
	created() {
		let url = `api/peminjaman-karyawan?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
		this.fetchDataFromServer(url);
		this.axioKaryawan();
	},
	methods: {
		resetForm() {
			this.formTitle = 'Tambah';
			this.form.karyawan_id = '';
			this.form.tgl_peminjaman = new Date().toISOString().substr(0, 10);
			this.form.nominal = '';
			this.form.alasan = '';
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
						this.karyawan_list.push(dashboard);
					});
				}
			} catch (error) {
				console.log(error);
			}
		},
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
			let url = `api/peminjaman-karyawan?per_page=${val}&page=1`;
			this.fetchDataFromServer(url);
		},
		goToPage(val = 0) {
			let url = `api/peminjaman-karyawan?per_page=${this.list.paginate.rowsPerPage}&page=${val}`;
			this.fetchDataFromServer(url);
		},
		addActionsToData(data) {
			return data.map((item) => ({
				...item,
				actions: [
					{ title: 'Ubah', icon: 'mdi-pencil' },
					{ title: 'Hapus', icon: 'mdi-delete' },
				],
			}));
		},
		handleActionClick({ action, item }) {
			switch (action.title) {
				case 'Ubah':
					this.resetForm();
					this.formTitle = 'Ubah';
					this.form.karyawan_id = item.karyawan_id;
					this.form.tgl_peminjaman = item.tgl_peminjaman;
					this.form.nominal = item.nominal;
					this.form.alasan = item.alasan;
					this.editId = item.uuid;
					this.dialogAddEdit = true;

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
				let url = `api/peminjaman-karyawan?per_page=10&page=1&keyword=${query}`;
				this.fetchDataFromServer(url);
			} else {
				this.snackbar.status = true;
				this.snackbar.color = 'red';
				this.snackbar.message = 'Harap masukkan minimal 3 kata pencarian!';
			}
		},
		cancelForm() {
			this.resetForm();
			this.dialogAddEdit = false;
		},
		submitForm() {
			this.btnLoading = true;

			if (this.formTitle == 'Tambah') {
				this.saveData();
			} else if (this.formTitle == 'Ubah') {
				this.updateData();
			}
		},
		async saveData() {
			this.peminjamanKaryawan.append('karyawan_id', this.form.karyawan_id);
			this.peminjamanKaryawan.append('tgl_peminjaman', this.form.tgl_peminjaman);
			this.peminjamanKaryawan.append('nominal', this.form.nominal);
			this.peminjamanKaryawan.append('alasan', this.form.alasan ? this.form.alasan : '');

			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.post('api/peminjaman-karyawan', this.peminjamanKaryawan, {
					headers,
				});
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogAddEdit = false;

					//fetch new data
					let url = `api/peminjaman-karyawan?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
					this.fetchDataFromServer(url);

					this.resetForm();
				}
			} catch (error) {
				this.snackbar.message = error.response.data.message;
				this.snackbar.color = 'red';
				this.snackbar.status = true;
				this.btnLoading = false;
				this.dialogAddEdit = false;
				this.resetForm();
			}
		},
		async updateData() {
			var data = new FormData();
			data.append('karyawan_id', this.form.karyawan_id);
			data.append('tgl_peminjaman', this.form.tgl_peminjaman);
			data.append('nominal', this.form.nominal);
			data.append('alasan', this.form.alasan ? this.form.alasan : '');

			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let editUrl = 'api/peminjaman-karyawan/' + this.editId;
				const response = await axios.post(editUrl, data, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogAddEdit = false;

					//fetch new data
					let url = `api/peminjaman-karyawan?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
					this.fetchDataFromServer(url);

					this.resetForm();
				}
			} catch (error) {
				this.snackbar.message = error.response.data.message;
				this.snackbar.color = 'red';
				this.snackbar.status = true;
				this.btnLoading = false;
				this.dialogAddEdit = false;
				this.resetForm();
			}
		},
		async deleteData() {
			this.btnLoading = true;

			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let deleteUrl = 'api/peminjaman-karyawan/' + this.deleteId;
				const response = await axios.delete(deleteUrl, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogDelete = false;

					//fetch new data
					let url = `api/peminjaman-karyawan?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
					this.fetchDataFromServer(url);

					this.resetForm();
				}
			} catch (error) {
				this.snackbar.message = error.response.data.message;
				this.snackbar.color = 'red';
				this.snackbar.status = true;
				this.btnLoading = false;
				this.dialogDelete = false;
				this.resetForm();
			}
		},
		updateFormattedDate(date) {
			// Update formatted date when a date is selected
			this.form.tgl_peminjaman_show = this.formatDate(date);
		},
		formatDate(date) {
			// Replace this logic with your date formatting function
			const options = { day: 'numeric', month: 'long', year: 'numeric' };
			return date ? new Date(date).toLocaleDateString('id-ID', options) : '';
		},
	},
};
</script>
