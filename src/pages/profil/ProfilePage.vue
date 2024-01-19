<template>
	<v-main>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Profil</h1>
			</div>
			<div class="profil-container">
				<v-card elevation="4">
					<v-card-text class="dialog-confirm-content text-center">
						<v-img
							contain
							height="250px"
							:src="baseUrl + form.foto"
							style="object-fit: cover"></v-img>
					</v-card-text>
					<v-card-actions class="justify-center">
						<v-btn dense class="primary--btn" @click="dialogUbahFoto = true">
							Ubah Foto Profil
						</v-btn>
						<v-btn dense class="primary--btn" @click="dialogUbahPassword = true">
							Ubah Kata Sandi
						</v-btn>
					</v-card-actions>
				</v-card>
				<v-card elevation="4">
					<v-card-title><p class="profile-subtitle">Informasi Pribadi</p></v-card-title>
					<v-card-text class="dialog-confirm-content">
						<v-text-field
							v-model="form.nama"
							label="Nama Lengkap"
							variant="underlined"></v-text-field>
						<v-text-field
							v-model="form.no_telp"
							label="Nomor Telepon"
							variant="underlined"></v-text-field>
						<v-text-field
							v-model="form.username"
							label="Nama Pengguna"
							variant="underlined"></v-text-field>
						<v-select
							:items="jabatan_list"
							v-model="form.jabatan_id"
							label="Jabatan"
							item-value="id"
							item-title="nama"
							variant="underlined"
							readonly></v-select>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn dense class="primary--btn" @click="updateProfil()" :loading="btnLoading"
							>Simpan</v-btn
						>
					</v-card-actions>
				</v-card>
			</div>
		</div>

		<v-dialog v-model="dialogUbahFoto" persistent max-width="600px">
			<v-card>
				<v-card-title class="dialog-confirm-title">
					<span class="headline white--text">Ubah Foto Profil</span>
				</v-card-title>
				<v-card-text>
					<v-file-input
						append-icon="mdi-camera"
						accept="image/*"
						label="Pilih Foto Karyawan"
						id="fotoKaryawan"
						variant="underlined"
						ref="fileKaryawan"></v-file-input>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn dense class="secondary--btn" @click="closeDialogFoto()">Batal</v-btn>
					<v-btn dense class="primary--btn" @click="updateFotoProfil()" :loading="btnLoadingDialog">
						Ubah
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<v-dialog v-model="dialogUbahPassword" persistent max-width="600px">
			<v-card>
				<v-card-title class="dialog-confirm-title">
					<span class="headline white--text">Ubah Kata Sandi</span>
				</v-card-title>
				<v-card-text>
					<v-form ref="form">
						<v-text-field
							v-model="formEdit.password"
							label="Kata Sandi Lama"
							:rules="old_password_rule"
							:type="show ? 'text' : 'password'"
							@click:append="show = !show"
							variant="underlined"
							:append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"></v-text-field>

						<v-text-field
							v-model="formEdit.newPassword"
							label="Kata Sandi Baru"
							:rules="new_password_rule"
							:type="show2 ? 'text' : 'password'"
							variant="underlined"
							@click:append="show2 = !show2"
							:append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'"></v-text-field>

						<v-text-field
							v-model="formEdit.confirmNewPassword"
							label="Konfirmasi Kata Sandi Baru"
							:rules="confirm_password_rule"
							:type="show3 ? 'text' : 'password'"
							variant="underlined"
							@click:append="show3 = !show3"
							:append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"></v-text-field>
					</v-form>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn dense class="secondary--btn" @click="closeDialogPassword()">Batal</v-btn>
					<v-btn dense class="primary--btn" @click="updatePassword()" :loading="btnLoadingDialog">
						Ubah
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

		<base-snackbar
			v-model="snackbar.status"
			:color="snackbar.color"
			:message="snackbar.message"></base-snackbar>
	</v-main>
</template>

<style scoped>
.profil-container {
	display: grid;
	grid-template-columns: 1fr 2fr;
	column-gap: 1rem;
	align-items: start;
}

.profile-subtitle {
	text-align: center;

	font-weight: 700;
	font-size: 1.4rem;
	letter-spacing: -0.5px;
	color: #333;
}
</style>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			btnLoading: false,
			btnLoadingDialog: false,
			show: false,
			show2: false,
			show3: false,
			previewImgLogo: '',
			userLogin: JSON.parse(localStorage.getItem('userLogin')),
			dialogUbahFoto: false,
			dialogUbahPassword: false,
			jabatan_list: [],
			statuses: ['Aktif', 'Izin', 'Tidak Aktif'],
			baseUrl: 'http://127.0.0.1:8000/storage/',
			snackbar: {
				status: false,
				color: '',
				message: '',
			},
			form: {
				nama: '',
				no_telp: '',
				username: '',
				status: '',
				jabatan_id: '',
				foto: '',
			},
			formEdit: {
				password: '',
				newPassword: '',
				confirmNewPassword: '',
				foto: '',
			},
			old_password_rule: [(v) => v != '' || 'Kata sandi lama tidak boleh kosong!'],
			new_password_rule: [(v) => v != '' || 'Kata sandi baru tidak boleh kosong!'],
			confirm_password_rule: [
				(v) => v != '' || 'Konfirmasi kata sandi baru tidak boleh kosong!',
				(v) => v === this.formEdit.newPassword || 'Kata sandi baru tidak sesuai!',
			],
		};
	},
	created() {
		this.axioData();
		this.axioJabatan();
	},
	methods: {
		async axioData() {
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				let url = 'api/profil/karyawan';
				const response = await axios.get(url, { headers });
				if (response.status == 200) {
					this.form.nama = response.data.data.nama;
					this.form.no_telp = response.data.data.no_telp;
					this.form.username = response.data.data.username;
					this.form.status = response.data.data.status;
					this.form.jabatan_id = response.data.data.jabatan_id;
					this.form.foto = response.data.data.foto;
				}
			} catch (error) {
				console.log(error);
			}
		},

		async axioJabatan() {
			try {
				let url = 'api/list-selection-jabatan';

				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

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

		async updateProfil() {
			try {
				this.btnLoading = true;

				var data = new FormData();
				data.append('jabatan_id', this.form.jabatan_id);
				data.append('nama', this.form.nama);
				data.append('no_telp', this.form.no_telp);
				data.append('username', this.form.username);
				data.append('status', this.form.status);

				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				var url = 'api/profil/karyawan';

				const response = await axios.post(url, data, { headers });
				if (response.status == 200) {
					this.btnLoading = false;
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.dialogAddEdit = false;
					this.axioData();
				}
			} catch (error) {
				this.btnLoading = false;
				this.snackbar.message = error.response.data.message;
				this.snackbar.color = 'red';
				this.snackbar.status = true;
			}
		},

		async updateFotoProfil() {
			try {
				this.btnLoadingDialog = true;

				var data = new FormData();
				var foto_karyawan = document.getElementById('fotoKaryawan'),
					dataFotoKaryawan = foto_karyawan.files[0];
				data.append('foto', dataFotoKaryawan);

				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				var url = 'api/profil/photo/karyawan';

				const response = await axios.post(url, data, { headers });
				if (response.status == 200) {
					this.btnLoadingDialog = false;
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.dialogAddEdit = false;
					this.axioData();
					this.closeDialogFoto();
				}
			} catch (error) {
				this.btnLoadingDialog = false;
				this.snackbar.message = error.response.data.message;
				this.snackbar.color = 'red';
				this.snackbar.status = true;
				this.closeDialogFoto();
			}
		},

		async updatePassword() {
			try {
				this.btnLoadingDialog = true;

				var data = new FormData();
				data.append('password', this.formEdit.password);
				data.append('newPassword', this.formEdit.newPassword);
				data.append('confirmNewPassword', this.formEdit.confirmNewPassword);

				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};
				var url = 'api/profil/password/karyawan';

				const response = await axios.post(url, data, { headers });
				if (response.status == 200) {
					this.btnLoadingDialog = false;
					this.snackbar.message = response.data.message;
					this.snackbar.color = 'green';
					this.snackbar.status = true;
					this.dialogAddEdit = false;
					this.axioData();
					this.closeDialogPassword();
				}
			} catch (error) {
				this.btnLoadingDialog = false;
				this.snackbar.message = error.response.data.message;
				this.snackbar.color = 'red';
				this.snackbar.status = true;
			}
		},

		closeDialogFoto() {
			this.formEdit = {
				foto: '',
			};
			this.$refs.fileKaryawan.reset();
			this.dialogUbahFoto = false;
		},

		closeDialogPassword() {
			this.formEdit = {
				password: '',
				newPassword: '',
				confirmNewPassword: '',
				foto: '',
			};
			this.$refs.form.reset();
			this.dialogUbahPassword = false;
		},
	},
};
</script>
