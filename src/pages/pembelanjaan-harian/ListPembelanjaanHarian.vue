<template>
	<v-main>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Pembelanjaan Harian</h1>
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
						<span class="headline white--text">{{ formTitle }} Data Pembelanjaan Harian</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<v-container v-if="formTitle == 'Tambah'">
							<v-text-field
								type="date"
								v-model="form.tgl_belanja"
								label="Tanggal Pembelanjaan"
								required
								variant="underlined"></v-text-field>
							<v-text-field
								v-model="form.nama"
								label="Nama Barang"
								required
								variant="underlined"></v-text-field>
							<v-text-field
								v-model="form.harga"
								label="Harga Barang"
								required
								variant="underlined"></v-text-field>
						</v-container>
						<v-container v-else>
							<v-text-field
								type="date"
								v-model="form.tgl_belanja"
								label="Tanggal Pembelanjaan"
								required
								variant="underlined"></v-text-field>
							<v-text-field
								v-model="form.nama"
								label="Nama Barang"
								required
								variant="underlined"></v-text-field>
							<v-text-field
								v-model="form.harga"
								label="Harga Barang"
								required
								variant="underlined"></v-text-field>
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
						<span class="headline white--text">Hapus Data Pembelanjaan Harian</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<span>Apakah Anda yakin ingin menghapus data pembelanjaan ini?</span>
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
					{ title: 'Tanggal', value: 'tgl_belanja', sortable: true, type: 'date' },
					{ title: 'Nama Barang', value: 'nama', sortable: true },
					{ title: 'Harga', value: 'harga', sortable: true, type: 'rupiah' },
					{ title: 'Aksi', value: 'actions', type: 'actions', sortable: false },
				],
				datas: [],
				loading: true,
				paginate: {
					rowsPerPage: 10,
					currentPage: 1,
				},
			},
			pembelanjaanHarian: new FormData(),
			editId: '',
			deleteId: '',
			form: {
				tgl_belanja: new Date().toISOString().substr(0, 10),
				nama: '',
				harga: '',
			},
			dialogAddEdit: false,
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
		let url = `api/pembelanjaan-harian?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
		this.fetchDataFromServer(url);
	},
	methods: {
		resetForm() {
			this.formTitle = 'Tambah';
			this.form.tgl_belanja = new Date().toISOString().substr(0, 10);
			this.form.nama = '';
			this.form.harga = '';
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
			let url = `api/pembelanjaan-harian?per_page=${val}&page=1`;
			this.fetchDataFromServer(url);
		},
		goToPage(val = 0) {
			let url = `api/pembelanjaan-harian?per_page=${this.list.paginate.rowsPerPage}&page=${val}`;
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
					this.form.tgl_belanja = item.tgl_belanja;
					this.form.nama = item.nama;
					this.form.harga = item.harga;
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
				let url = `api/pembelanjaan-harian?per_page=10&page=1&keyword=${query}`;
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
			this.pembelanjaanHarian.append('tgl_belanja', this.form.tgl_belanja);
			this.pembelanjaanHarian.append('nama', this.form.nama);
			this.pembelanjaanHarian.append('harga', this.form.harga);

			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.post('api/pembelanjaan-harian', this.pembelanjaanHarian, {
					headers,
				});
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogAddEdit = false;

					//fetch new data
					let url = `api/pembelanjaan-harian?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
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
			data.append('tgl_belanja', this.form.tgl_belanja);
			data.append('nama', this.form.nama);
			data.append('harga', this.form.harga);

			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let editUrl = 'api/pembelanjaan-harian/' + this.editId;
				const response = await axios.post(editUrl, data, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogAddEdit = false;

					//fetch new data
					let url = `api/pembelanjaan-harian?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
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

				let deleteUrl = 'api/pembelanjaan-harian/' + this.deleteId;
				const response = await axios.delete(deleteUrl, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogDelete = false;

					//fetch new data
					let url = `api/pembelanjaan-harian?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
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
	},
};
</script>
