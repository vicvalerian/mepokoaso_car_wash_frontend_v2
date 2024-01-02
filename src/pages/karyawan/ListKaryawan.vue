<template>
	<v-main>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Karyawan</h1>
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
						<span class="headline white--text">{{ formTitle }} Data Karyawan</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<v-container v-if="formTitle == 'Tambah'">
							<v-select
								:items="jabatan_list"
								v-model="form.jabatan_id"
								label="Jabatan Karyawan"
								item-value="id"
								item-title="nama"
								variant="underlined"
								required></v-select>
							<v-text-field
								v-model="form.nama"
								label="Nama Karyawan"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.no_telp"
								label="Nomor Telepon Karyawan"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.username"
								label="Nama Pengguna Karyawan"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.gaji"
								label="Gaji Karyawan"
								variant="underlined"
								required></v-text-field>
							<v-select
								:items="statuses"
								v-model="form.status"
								label="Status Karyawan"
								item-value="id"
								item-title="nama"
								variant="underlined"
								required></v-select>
							<v-file-input
								append-icon="mdi-camera"
								accept="image/*"
								label="Foto Karyawan"
								id="fotoKaryawan"
								variant="underlined"
								ref="fileKaryawan"></v-file-input>
						</v-container>
						<v-container v-else>
							<v-select
								:items="jabatan_list"
								v-model="form.jabatan_id"
								label="Jabatan Karyawan"
								item-value="id"
								item-title="nama"
								variant="underlined"
								required></v-select>
							<v-text-field
								v-model="form.nama"
								label="Nama Karyawan"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.no_telp"
								label="Nomor Telepon Karyawan"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.username"
								label="Nama Pengguna Karyawan"
								variant="underlined"
								required></v-text-field>
							<v-text-field
								v-model="form.gaji"
								label="Gaji Karyawan"
								variant="underlined"
								required></v-text-field>
							<v-select
								:items="statuses"
								v-model="form.status"
								label="Status Karyawan"
								item-value="id"
								item-title="nama"
								variant="underlined"
								required></v-select>
							<v-file-input
								append-icon="mdi-camera"
								accept="image/*"
								label="Foto Karyawan"
								id="fotoKaryawan"
								variant="underlined"
								ref="fileKaryawan"></v-file-input>
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
						<span class="headline white--text">Hapus Data Karyawan</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<span>Apakah Anda yakin ingin menghapus data karyawan ini?</span>
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

			<v-dialog v-model="dialogDetail" persistent max-width="600px">
				<v-card>
					<v-card-title class="dialog-confirm-title">
						<span class="headline white--text">Detail Data Karyawan</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-content">
						<v-container fluid>
							<v-layout justify-center>
								<v-row>
									<v-col class="mr-4">
										<img
											v-if="formDetail.foto"
											:src="baseUrl + formDetail.foto"
											alt="Foto Karyawan Mepokoaso CarWash"
											width="100%"
											style="object-fit: cover; margin-top: 0.5rem; margin-bottom: 0.5rem" />
										<span v-else>Tidak Ada Gambar</span>
									</v-col>
									<v-col>
										<v-text-field
											v-model="formDetail.jabatan"
											label="Jabatan"
											variant="underlined"
											readonly></v-text-field>
										<v-text-field
											v-model="formDetail.nama"
											label="Nama Karyawan"
											variant="underlined"
											readonly></v-text-field>
										<v-text-field
											v-model="formDetail.no_telp"
											label="Nomor Telepon Karyawan"
											variant="underlined"
											readonly></v-text-field>
										<v-text-field
											v-model="formDetail.username"
											label="Nama Pengguna Karyawan"
											variant="underlined"
											readonly></v-text-field>
										<v-text-field
											v-model="formDetail.gaji"
											label="Gaji Karyawan"
											variant="underlined"
											readonly></v-text-field>
										<v-text-field
											v-model="formDetail.status"
											label="Status Karyawan"
											variant="underlined"
											readonly></v-text-field>
									</v-col>
								</v-row>
							</v-layout>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn dense class="secondary--btn" @click="dialogDetail = false">Tutup</v-btn>
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
			baseUrl: 'http://127.0.0.1:8000/storage/',
			statuses: ['Aktif', 'Izin', 'Tidak Aktif'],
			jabatan_list: [],
			userLogin: JSON.parse(localStorage.getItem('userLogin')),
			formTitle: 'Tambah',
			list: {
				headers: [
					{ title: 'No', value: 'nomor', width: '5%', type: 'number' },
					{ title: 'Jabatan', value: 'jabatan.nama', sortable: true, type: 'nested' },
					{ title: 'Nama', value: 'nama', sortable: true },
					{ title: 'Nomor Telepon', value: 'no_telp', sortable: true },
					{ title: 'Gaji', value: 'gaji', sortable: true, type: 'rupiah' },
					{ title: 'Foto', value: 'foto', sortable: false, type: 'image' },
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
			karyawan: new FormData(),
			editId: '',
			deleteId: '',
			form: {
				jabatan_id: '',
				nama: '',
				no_telp: '',
				username: '',
				gaji: '',
				foto: '',
				status: '',
			},
			formDetail: {
				jabatan: '',
				nama: '',
				no_telp: '',
				username: '',
				gaji: '',
				foto: '',
				status: '',
			},
			dialogAddEdit: false,
			dialogDelete: false,
			dialogDetail: false,
			snackbar: {
				status: false,
				message: '',
				color: '',
			},
			btnLoading: false,
		};
	},
	created() {
		let url = `api/karyawan?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
		this.fetchDataFromServer(url);
		this.axioJabatan();
	},
	methods: {
		resetForm() {
			this.formTitle = 'Tambah';
			this.editId = '';
			this.deleteId = '';
			this.form.nama = '';
			this.form.jabatan_id = '';
			this.form.nama = '';
			this.form.no_telp = '';
			this.form.username = '';
			this.form.gaji = '';
			this.form.status = '';
			this.form.foto = '';
		},
		async axioJabatan() {
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let url = 'api/list-selection-jabatan';

				const response = await axios.get(url, { headers });
				if (response.status == 200) {
					let data = JSON.parse(JSON.stringify(response.data));
					data.forEach((item) => {
						let dashboard = item;
						dashboard.text = item.nama;
						dashboard.value = item.id;
						this.jabatan_list.push(dashboard);
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
			let url = `api/karyawan?per_page=${val}&page=1`;
			this.fetchDataFromServer(url);
		},
		goToPage(val = 0) {
			let url = `api/karyawan?per_page=${this.list.paginate.rowsPerPage}&page=${val}`;
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
					this.formDetail.jabatan = item.jabatan.nama;
					this.formDetail.nama = item.nama;
					this.formDetail.no_telp = item.no_telp;
					this.formDetail.username = item.username;
					this.formDetail.foto = item.foto;
					this.formDetail.gaji = item.gaji ? this.formatRupiah(item.gaji, 'Rp') : 'Rp0';
					this.formDetail.status = item.status;
					this.dialogDetail = true;
					break;

				case 'Ubah':
					this.resetForm();
					this.formTitle = 'Ubah';
					this.form.nama = item.nama;
					this.form.jabatan_id = item.jabatan_id;
					this.form.nama = item.nama;
					this.form.no_telp = item.no_telp;
					this.form.username = item.username;
					this.form.gaji = item.gaji ? item.gaji : 0;
					this.form.status = item.status;
					this.form.foto = item.foto;
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
				let url = `api/karyawan?per_page=10&page=1&keyword=${query}`;
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
			this.karyawan.append('jabatan_id', this.form.jabatan_id);
			this.karyawan.append('nama', this.form.nama);
			this.karyawan.append('no_telp', this.form.no_telp);
			this.karyawan.append('username', this.form.username);
			this.karyawan.append('gaji', this.form.gaji);
			this.karyawan.append('status', this.form.status);

			var foto_karyawan = document.getElementById('fotoKaryawan'),
				dataFotoKaryawan = foto_karyawan.files[0];
			this.karyawan.append('foto', dataFotoKaryawan);

			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.post('api/karyawan', this.karyawan, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogAddEdit = false;

					//fetch new data
					let url = `api/karyawan?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
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
			data.append('jabatan_id', this.form.jabatan_id);
			data.append('nama', this.form.nama);
			data.append('no_telp', this.form.no_telp);
			data.append('username', this.form.username);
			data.append('gaji', this.form.gaji);
			data.append('status', this.form.status);

			var foto_karyawan = document.getElementById('fotoKaryawan'),
				dataFotoKaryawan = foto_karyawan.files[0];

			if (dataFotoKaryawan) {
				data.append('foto', dataFotoKaryawan);
			}

			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let editUrl = 'api/karyawan/' + this.editId;
				const response = await axios.post(editUrl, data, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogAddEdit = false;

					//fetch new data
					let url = `api/karyawan?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
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

				let deleteUrl = 'api/karyawan/' + this.deleteId;
				const response = await axios.delete(deleteUrl, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogDelete = false;

					//fetch new data
					let url = `api/karyawan?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
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
	},
};
</script>
