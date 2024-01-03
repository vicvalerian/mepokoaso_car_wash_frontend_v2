<template>
	<v-main>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Menu Kedai</h1>
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
						<span class="headline white--text">{{ formTitle }} Data Menu Kedai</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<v-container v-if="formTitle == 'Tambah'">
							<v-select
								:items="jenis_makanan_list"
								v-model="form.jenis"
								label="Jenis Menu"
								item-value="id"
								item-title="nama"
								variant="underlined"
								required></v-select>
							<v-text-field
								v-model="form.nama"
								label="Nama Menu"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.harga"
								label="Harga Menu"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.stok"
								label="Stok Menu"
								variant="underlined"
								required></v-text-field>
							<v-select
								:items="fieldBolean"
								label="Memiliki Stok"
								variant="underlined"
								v-model="form.is_stok"></v-select>
						</v-container>
						<v-container v-else>
							<v-select
								:items="jenis_makanan_list"
								v-model="form.jenis"
								label="Jenis Menu"
								item-value="id"
								item-title="nama"
								variant="underlined"
								required></v-select>
							<v-text-field
								v-model="form.nama"
								label="Nama Menu"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.harga"
								label="Harga Menu"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.stok"
								label="Stok Menu"
								variant="underlined"
								required></v-text-field>
							<v-select
								:items="fieldBolean"
								label="Memiliki Stok"
								variant="underlined"
								v-model="form.is_stok"></v-select>
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
						<span class="headline white--text">Hapus Data Menu Kedai</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<span>Apakah Anda yakin ingin menghapus data menu kedai ini?</span>
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
					{ title: 'Jenis', value: 'jenis', sortable: true },
					{ title: 'Nama', value: 'nama', sortable: true },
					{ title: 'Harga', value: 'harga', sortable: true, type: 'rupiah' },
					{ title: 'Stok', value: 'stok', sortable: true },
					{ title: 'Aksi', value: 'actions', type: 'actions', sortable: false, width: '30%' },
				],
				datas: [],
				loading: true,
				paginate: {
					rowsPerPage: 10,
					currentPage: 1,
				},
			},
			menuKedai: new FormData(),
			editId: '',
			deleteId: '',
			form: {
				nama: '',
				harga: '',
				jenis: '',
				stok: '',
				is_stok: '',
			},
			dialogAddEdit: false,
			dialogDelete: false,
			snackbar: {
				status: false,
				message: '',
				color: '',
			},
			btnLoading: false,
			fieldBolean: [
				{ title: 'Ya', value: 1 },
				{ title: 'Tidak', value: 0 },
			],
			jenis_makanan_list: ['Makanan', 'Minuman'],
		};
	},
	created() {
		let url = `api/menu-kedai?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
		this.fetchDataFromServer(url);
	},
	methods: {
		resetForm() {
			this.formTitle = 'Tambah';
			this.form.nama = '';
			this.form.harga = '';
			this.form.is_stok = '';
			this.form.jenis = '';
			this.form.stok = '';
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
			let url = `api/menu-kedai?per_page=${val}&page=1`;
			this.fetchDataFromServer(url);
		},
		goToPage(val = 0) {
			let url = `api/menu-kedai?per_page=${this.list.paginate.rowsPerPage}&page=${val}`;
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
					this.form.nama = item.nama;
					this.form.harga = item.harga;
					this.form.jenis = item.jenis;
					this.form.stok = item.stok;
					this.form.is_stok = item.is_stok;
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
				let url = `api/menu-kedai?per_page=10&page=1&keyword=${query}`;
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
			this.menuKedai.append('nama', this.form.nama);
			this.menuKedai.append('jenis', this.form.jenis);
			this.menuKedai.append('harga', this.form.harga);
			this.menuKedai.append('stok', this.form.stok ? this.form.stok : 0);
			this.menuKedai.append('is_stok', this.form.is_stok);

			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.post('api/menu-kedai', this.menuKedai, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogAddEdit = false;

					//fetch new data
					let url = `api/menu-kedai?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
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
			data.append('nama', this.form.nama);
			data.append('jenis', this.form.jenis);
			data.append('harga', this.form.harga);
			data.append('stok', this.form.stok ? this.form.stok : 0);
			data.append('is_stok', this.form.is_stok);

			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let editUrl = 'api/menu-kedai/' + this.editId;
				const response = await axios.post(editUrl, data, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogAddEdit = false;

					//fetch new data
					let url = `api/menu-kedai?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
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

				let deleteUrl = 'api/menu-kedai/' + this.deleteId;
				const response = await axios.delete(deleteUrl, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogDelete = false;

					//fetch new data
					let url = `api/menu-kedai?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
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
