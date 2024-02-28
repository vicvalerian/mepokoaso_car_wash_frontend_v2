<template>
	<v-main>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Gaji Karyawan</h1>
				<v-btn rounded="sm" elevation="0" class="primary--btn" @click="dialogAddEdit = true">
					Sinkronisasi Gaji
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
						<span class="headline white--text">{{ formTitle }} Data Jabatan</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-text">
						<v-container v-if="formTitle == 'Sync'">
							<v-autocomplete
								:items="karyawan_list"
								v-model="form.karyawan_id"
								label="Pilih Karyawan"
								item-value="id"
								item-title="nama"
								variant="underlined"
								required></v-autocomplete>
							<v-select
								:items="select_bulan"
								label="Pilih Bulan"
								variant="underlined"
								v-model="form.bulan"></v-select>
							<v-select
								:items="select_tahun"
								label="Pilih Tahun"
								variant="underlined"
								v-model="form.tahun"></v-select>
						</v-container>
						<v-container v-else>
							<v-autocomplete
								:items="karyawan_list"
								v-model="form.karyawan_id"
								label="Nama Karyawan"
								item-value="id"
								item-title="nama"
								readonly
								variant="underlined"
								required></v-autocomplete>
							<v-layout justify>
								<v-select
									:items="select_bulan"
									label="Bulan"
									v-model="form.bulan"
									variant="underlined"
									readonly></v-select>

								<v-spacer></v-spacer>

								<v-select
									:items="select_tahun"
									label="Tahun"
									v-model="form.tahun"
									variant="underlined"
									readonly></v-select>
							</v-layout>
							<v-text-field
								v-model="form.total_gaji_kotor"
								label="Total Gaji Kotor"
								variant="underlined"
								readonly></v-text-field>
							<v-text-field
								v-model="form.total_utang"
								label="Total Utang"
								variant="underlined"
								readonly></v-text-field>
							<v-text-field
								v-model="form.total_gaji_bersih"
								label="Total Gaji Bersih"
								variant="underlined"
								readonly></v-text-field>
							<v-select
								:items="statuses"
								label="Pilih Status"
								variant="underlined"
								v-model="form.status"></v-select>
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

			<v-dialog v-model="dialogDetail" persistent max-width="600px">
				<v-card>
					<v-card-title class="dialog-confirm-title">
						<span class="headline white--text">Detail Gaji Karyawan</span>
					</v-card-title>
					<v-card-text class="dialog-confirm-content">
						<v-container fluid>
							<div>
								<div>
									<v-text-field
										v-model="formDetail.karyawan"
										label="Nama Karyawan"
										variant="underlined"
										readonly></v-text-field>

									<div class="d-flex">
										<v-text-field
											v-model="formDetail.bulan"
											label="Bulan Gaji"
											variant="underlined"
											readonly></v-text-field>

										<v-spacer></v-spacer>

										<v-text-field
											v-model="formDetail.tahun"
											label="Tahun Gaji"
											variant="underlined"
											readonly></v-text-field>
									</div>
									<v-text-field
										v-model="formDetail.total_gaji_kotor"
										label="Total Gaji Kotor"
										variant="underlined"
										readonly></v-text-field>
									<v-text-field
										v-model="formDetail.total_utang"
										label="Total Utang"
										variant="underlined"
										readonly></v-text-field>
									<v-text-field
										v-model="formDetail.total_gaji_bersih"
										label="Total Gaji Bersih"
										variant="underlined"
										readonly></v-text-field>
									<v-text-field
										v-model="formDetail.status"
										label="Status Gaji"
										variant="underlined"
										readonly></v-text-field>
								</div>
							</div>
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
			userLogin: JSON.parse(localStorage.getItem('userLogin')),
			formTitle: 'Sync',
			list: {
				headers: [
					{ title: 'No', value: 'nomor', width: '5%', type: 'number' },
					{ title: 'Nama Karyawan', value: 'karyawan.nama', sortable: true, type: 'nested' },
					{ title: 'Bulan', value: 'bulan', sortable: true },
					{ title: 'Tahun', value: 'tahun', sortable: true },
					{ title: 'Total Diterima', value: 'total_gaji_bersih', sortable: true, type: 'rupiah' },
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
			jabatan: new FormData(),
			editId: '',
			deleteId: '',
			formDetail: {
				karyawan: '',
				bulan: '',
				tahun: '',
				total_gaji_kotor: '',
				total_utang: '',
				total_gaji_bersih: '',
				status: '',
			},
			form: {
				karyawan_id: '',
				bulan: '',
				tahun: '',
				status: '',
				total_gaji_kotor: '',
				total_gaji_bersih: '',
				total_utang: '',
			},
			dialogAddEdit: false,
			dialogDetail: false,
			snackbar: {
				status: false,
				message: '',
				color: '',
			},
			btnLoading: false,
			karyawan_list: [],
			select_bulan: [
				'Januari',
				'Februari',
				'Maret',
				'April',
				'Mei',
				'Juni',
				'Juli',
				'Agustus',
				'September',
				'Oktober',
				'November',
				'Desember',
			],
			select_tahun: [],
			statuses: ['Utang', 'Belum Diterima', 'Sudah Diterima'],
		};
	},
	created() {
		let url = `api/gaji-karyawan?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
		this.fetchDataFromServer(url);
		this.axioKaryawan();
		this.dynamicYearDropdown();
	},
	methods: {
		dynamicYearDropdown() {
			let currentYear = new Date().getFullYear();
			let earliestYear = 2021;

			while (currentYear >= earliestYear) {
				this.select_tahun.push(currentYear);
				currentYear -= 1;
			}
		},
		resetForm() {
			this.formTitle = 'Sync';
			this.form.karyawan_id = '';
			this.form.bulan = '';
			this.form.tahun = '';
			this.form.status = '';
			this.form.total_gaji_kotor = '';
			this.form.total_utang = '';
			this.form.total_gaji_bersih = '';
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
			let url = `api/gaji-karyawan?per_page=${val}&page=1`;
			this.fetchDataFromServer(url);
		},
		goToPage(val = 0) {
			let url = `api/gaji-karyawan?per_page=${this.list.paginate.rowsPerPage}&page=${val}`;
			this.fetchDataFromServer(url);
		},
		addActionsToData(data) {
			return data.map((item) => ({
				...item,
				actions: [
					{ title: 'Lihat Detail', icon: 'mdi-information' },
					{ title: 'Ubah', icon: 'mdi-pencil' },
				],
			}));
		},
		handleActionClick({ action, item }) {
			switch (action.title) {
				case 'Lihat Detail':
					this.dialogDetail = true;
					this.formDetail.karyawan = item.karyawan.nama;
					this.formDetail.bulan = item.bulan;
					this.formDetail.tahun = item.tahun;
					this.formDetail.status = item.status;
					this.formDetail.total_gaji_kotor = this.formatRupiah(item.total_gaji_kotor, 'Rp');
					this.formDetail.total_utang = this.formatRupiah(item.total_utang, 'Rp');
					this.formDetail.total_gaji_bersih = this.formatRupiah(item.total_gaji_bersih, 'Rp');
					break;

				case 'Ubah':
					this.resetForm();
					this.formTitle = 'Ubah';
					this.form.karyawan_id = item.karyawan_id;
					this.form.bulan = item.bulan;
					this.form.tahun = item.tahun;
					this.form.status = item.status;
					this.form.total_gaji_kotor = this.formatRupiah(item.total_gaji_kotor, 'Rp');
					this.form.total_utang = this.formatRupiah(item.total_utang, 'Rp');
					this.form.total_gaji_bersih = this.formatRupiah(item.total_gaji_bersih, 'Rp');
					this.editId = item.uuid;
					this.dialogAddEdit = true;

					break;

				default:
					break;
			}
		},
		xSearch({ query }) {
			if (query.length > 2 || query.length == 0) {
				let url = `api/gaji-karyawan?per_page=10&page=1&keyword=${query}`;
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

			if (this.formTitle == 'Sync') {
				this.syncData();
			} else if (this.formTitle == 'Ubah') {
				this.updateData();
			}
		},
		async syncData() {
			let syncUrl = `api/gaji-karyawan?karyawan_id=${this.form.karyawan_id}&bulan=${this.form.bulan}&tahun=${this.form.tahun}`;
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.post(syncUrl, null, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogAddEdit = false;

					//fetch new data
					let url = `api/gaji-karyawan?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
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
			let data = {
				status: this.form.status,
			};

			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let editUrl = 'api/gaji-karyawan/status/' + this.editId;
				const response = await axios.put(editUrl, data, { headers });
				if (response.status == 200) {
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.btnLoading = false;
					this.dialogAddEdit = false;

					//fetch new data
					let url = `api/gaji-karyawan?per_page=${this.list.paginate.rowsPerPage}&page=${this.list.paginate.currentPage}`;
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
