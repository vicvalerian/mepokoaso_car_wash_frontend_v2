<template>
	<v-main>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Pengeluaran Kedai</h1>
				<v-btn rounded="sm" elevation="0" class="primary--btn" @click="dialogSelect = true">
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

			<v-dialog v-model="dialogSelect" persistent max-width="600px">
				<v-card>
					<v-card-title class="dialog-confirm-title">
						<span class="headline white--text">{{ formTitle }} Data Pengeluaran Kedai</span>
					</v-card-title>
					<v-card-text class="text">
						<div class="dialog-select-content">
							<v-btn dense class="primary--btn" @click="openSelectedDialogStok(true)">Stok</v-btn>
							<v-btn dense class="primary--btn" @click="openSelectedDialogStok(false)"
								>Tanpa Stok</v-btn
							>
						</div>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn dense class="secondary--btn" @click="dialogSelect = false">Batal</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<v-dialog v-model="dialogAddEditStok" persistent max-width="600px">
				<v-card>
					<v-card-title class="dialog-confirm-title">
						<span class="headline white--text">{{ formTitle }} Data Pengeluaran Kedai Stok</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<v-container v-if="inputType == 'Tambah'">
							<v-autocomplete
								:items="menu_kedai_list"
								item-value="id"
								item-title="nama"
								v-model="form.menu_kedai_id"
								label="Nama Barang"
								variant="underlined"
								required></v-autocomplete>
							<v-text-field
								type="date"
								v-model="form.tgl_pembelian"
								label="Tanggal Pembelian"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.jumlah_barang"
								label="Jumlah Barang (pcs)"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.harga_pembelian"
								label="Harga Pembelian"
								variant="underlined"
								required></v-text-field>
						</v-container>
						<v-container v-else>
							<v-autocomplete
								:items="menu_kedai_list"
								item-value="id"
								item-title="nama"
								v-model="form.menu_kedai_id"
								label="Nama Barang"
								variant="underlined"
								required></v-autocomplete>
							<v-text-field
								type="date"
								v-model="form.tgl_pembelian"
								label="Tanggal Pembelian"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.jumlah_barang"
								label="Jumlah Barang (pcs)"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.harga_pembelian"
								label="Harga Pembelian"
								variant="underlined"
								required></v-text-field>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn dense class="secondary--btn" @click="cancelForm()">Batal</v-btn>
						<v-btn dense class="primary--btn" :loading="btnLoading" @click="submitForm()"
							>Simpan</v-btn
						>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<v-dialog v-model="dialogAddEditNonStok" persistent max-width="600px">
				<v-card>
					<v-card-title class="dialog-confirm-title">
						<span class="headline white--text"
							>{{ formTitle }} Data Pengeluaran Kedai Tanpa Stok</span
						>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<v-container v-if="inputType == 'Tambah'">
							<v-text-field
								v-model="form.nama_barang"
								label="Nama Barang"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								type="date"
								v-model="form.tgl_pembelian"
								label="Tanggal Pembelian"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.jumlah_barang"
								label="Jumlah Barang (pcs)"
								required></v-text-field>
							<v-text-field
								v-model="form.harga_pembelian"
								label="Harga Pembelian"
								variant="underlined"
								required></v-text-field>
						</v-container>
						<v-container v-else>
							<v-text-field
								v-model="form.nama_barang"
								label="Nama Barang"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								type="date"
								v-model="form.tgl_pembelian"
								label="Tanggal Pembelian"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.jumlah_barang"
								label="Jumlah Barang (pcs)"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.harga_pembelian"
								label="Harga Pembelian"
								variant="underlined"
								required></v-text-field>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn dense class="secondary--btn" @click="cancelForm()">Batal</v-btn>
						<v-btn dense class="primary--btn" :loading="btnLoading" @click="submitForm()"
							>Simpan</v-btn
						>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<v-dialog v-model="dialogDelete" persistent max-width="400px">
				<v-card>
					<v-card-title class="dialog-confirm-title">
						<span class="headline white--text">Hapus Data Pengeluaran Kedai</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<span>Apakah Anda yakin ingin menghapus data pengeluaran kedai ini?</span>
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

<style scoped>
.dialog-select-content {
	display: grid;
	grid-template-columns: 1fr;
	row-gap: 1.2rem;
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
					{ title: 'Nama Barang', value: 'nama_barang', sortable: true },
					{ title: 'Tanggal Pembelian', value: 'tgl_pembelian', sortable: true, type: 'date' },
					{ title: 'Jumlah Barang (pcs)', value: 'jumlah_barang', sortable: true },
					{ title: 'Harga Pembelian', value: 'harga_pembelian', sortable: true, type: 'rupiah' },
					{ title: 'Aksi', value: 'actions', type: 'actions', sortable: false },
				],
				datas: [],
				loading: true,
				paginate: {
					rowsPerPage: 10,
					currentPage: 1,
				},
			},
			pengeluaranKedai: new FormData(),
			editId: '',
			deleteId: '',
			form: {
				menu_kedai_id: '',
				nama_barang: '',
				tgl_pembelian: new Date().toISOString().substr(0, 10),
				jumlah_barang: '',
				harga_pembelian: '',
			},
			dialogAddEditStok: false,
			dialogAddEditNonStok: false,
			dialogDelete: false,
			dialogSelect: false,
			snackbar: {
				status: false,
				message: '',
				color: '',
			},
			btnLoading: false,
			menu_kedai_list: [],
		};
	},
	created() {
		let url = `api/pengeluaran-kedai?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
		this.fetchDataFromServer(url);
		this.axioMenuKedai();
	},
	methods: {
		resetForm() {
			this.formTitle = 'Tambah';
			this.form.menu_kedai_id = '';
			this.form.nama_barang = '';
			this.form.tgl_pembelian = new Date().toISOString().substr(0, 10);
			this.form.jumlah_barang = '';
			this.form.harga_pembelian = '';
		},
		async axioMenuKedai() {
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let url = 'api/list-selection-menu-kedai';

				const response = await axios.get(url, { headers });
				if (response.status == 200) {
					let data = JSON.parse(JSON.stringify(response.data));
					data.forEach((item) => {
						let dashboard = item;
						dashboard.text = item.nama;
						dashboard.value = item.id;
						this.menu_kedai_list.push(dashboard);
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
			let url = `api/pengeluaran-kedai?per_page=${val}&page=1`;
			this.fetchDataFromServer(url);
		},
		goToPage(val = 0) {
			let url = `api/pengeluaran-kedai?per_page=${this.list.paginate.rowsPerPage}&page=${val}`;
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
					this.editId = item.uuid;
					this.form.menu_kedai_id = item.menu_kedai_id;
					this.form.nama_barang = item.nama_barang;
					this.form.tgl_pembelian = item.tgl_pembelian;
					this.form.jumlah_barang = item.jumlah_barang;
					this.form.harga_pembelian = item.harga_pembelian;

					if (item.menu_kedai_id != null) {
						this.dialogAddEditStok = true;
					} else if (item.menu_kedai_id == null) {
						this.dialogAddEditNonStok = true;
					}

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
				let url = `api/pengeluaran-kedai?per_page=10&page=1&keyword=${query}`;
				this.fetchDataFromServer(url);
			} else {
				this.snackbar.status = true;
				this.snackbar.color = 'red';
				this.snackbar.message = 'Harap masukkan minimal 3 kata pencarian!';
			}
		},
		cancelForm() {
			this.resetForm();
			this.dialogAddEditStok = false;
			this.dialogAddEditNonStok = false;
		},
		submitForm() {
			this.btnLoading = true;

			if (this.formTitle == 'Tambah') {
				this.saveData();
			} else if (this.formTitle == 'Ubah') {
				this.updateData();
			}
		},
		openSelectedDialogStok(value) {
			this.dialogSelect = false;
			if (value == true) {
				this.dialogAddEditStok = true;
			} else if (value == false) {
				this.dialogAddEditNonStok = true;
			}
		},
		async saveData() {
			this.pengeluaranKedai.append(
				'menu_kedai_id',
				this.form.menu_kedai_id ? this.form.menu_kedai_id : ''
			);
			this.pengeluaranKedai.append('nama_barang', this.form.nama_barang);
			this.pengeluaranKedai.append('tgl_pembelian', this.form.tgl_pembelian);
			this.pengeluaranKedai.append('jumlah_barang', this.form.jumlah_barang);
			this.pengeluaranKedai.append('harga_pembelian', this.form.harga_pembelian);

			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.post('api/pengeluaran-kedai', this.pengeluaranKedai, {
					headers,
				});
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogAddEditStok = false;
					this.dialogAddEditNonStok = false;

					//fetch new data
					let url = `api/pengeluaran-kedai?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
					this.fetchDataFromServer(url);

					this.resetForm();
				}
			} catch (error) {
				this.snackbar.message = error.response.data.message;
				this.snackbar.color = 'red';
				this.snackbar.status = true;
				this.btnLoading = false;
				this.dialogAddEditStok = false;
				this.dialogAddEditNonStok = false;
				this.resetForm();
			}
		},
		async updateData() {
			var data = new FormData();
			data.append('menu_kedai_id', this.form.menu_kedai_id ? this.form.menu_kedai_id : '');
			data.append('nama_barang', this.form.nama_barang);
			data.append('tgl_pembelian', this.form.tgl_pembelian);
			data.append('jumlah_barang', this.form.jumlah_barang);
			data.append('harga_pembelian', this.form.harga_pembelian);

			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let editUrl = 'api/pengeluaran-kedai/' + this.editId;
				const response = await axios.post(editUrl, data, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogAddEditStok = false;
					this.dialogAddEditNonStok = false;

					//fetch new data
					let url = `api/pengeluaran-kedai?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
					this.fetchDataFromServer(url);

					this.resetForm();
				}
			} catch (error) {
				this.snackbar.message = error.response.data.message;
				this.snackbar.color = 'red';
				this.snackbar.status = true;
				this.btnLoading = false;
				this.dialogAddEditStok = false;
				this.dialogAddEditNonStok = false;
				this.resetForm();
			}
		},
		async deleteData() {
			this.btnLoading = true;

			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let deleteUrl = 'api/pengeluaran-kedai/' + this.deleteId;
				const response = await axios.delete(deleteUrl, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogDelete = false;

					//fetch new data
					let url = `api/pengeluaran-kedai?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
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
	watch: {
		'form.menu_kedai_id'(val) {
			this.menu_kedai_list.forEach((item) => {
				if (item.id == val) {
					this.form.nama_barang = item.nama;
				}
			});
		},
	},
};
</script>
