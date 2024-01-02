<template>
	<v-app>
		<div class="section-login">
			<v-card class="mx-auto login-card" width="1000">
				<div class="login">
					<div class="form-container">
						<v-card-title class="login-title">
							<img src="../assets/icon.png" alt="Logo Mepokoaso Car Wash" class="login-logo" />
						</v-card-title>
						<v-card-text>
							<h1 class="login-heading-primary">Selamat datang kembali</h1>
							<h3 class="login-heading-tertiary">Silahkan masuk untuk memulai sesi anda!</h3>
							<v-form>
								<v-text-field
									:disabled="loading ? true : false"
									label="Nama Pengguna"
									rounded=""
									variant="outlined"
									:rules="rules"
									v-model="username"
									color="#316291"></v-text-field>
								<v-text-field
									:disabled="loading ? true : false"
									type="password"
									label="Kata Sandi"
									rounded=""
									variant="outlined"
									:rules="rules"
									v-model="password"
									color="#316291"></v-text-field>
								<v-btn variant="outlined" class="login-btn" :loading="loading" @click="submitLogin">
									Masuk
								</v-btn>
							</v-form>
							<p class="copyright">&copy;2023 Vicvalerian All rights reserved.</p>
						</v-card-text>
					</div>
					<div class="login-img-container" role="img" aria-label="User Login in Website"></div>
				</div>
			</v-card>
		</div>
		<base-snackbar
			v-model="snackbar.status"
			:color="snackbar.color"
			:message="snackbar.message"></base-snackbar>
	</v-app>
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			username: '',
			password: '',
			loading: false,
			snackbar: {
				status: false,
				message: '',
				color: '',
			},
			rules: [
				(value) => {
					if (value) return true;

					return 'Inputan tidak boleh kosong!';
				},
			],
		};
	},
	methods: {
		async submitLogin() {
			this.loading = true;
			let data = {
				username: this.username,
				password: this.password,
			};
			try {
				const response = await axios.post('api/login', data);

				if (response.status == 200) {
					const data = response.data;
					let userLogin = {
						token: data.data.token,
						jabatan: data.data.jabatan.nama,
					};

					localStorage.setItem('userLogin', JSON.stringify(userLogin));

					setTimeout(() => {
						this.loading = false;
						this.snackbar.status = true;
						this.snackbar.message = 'Login Berhasil!';
						this.snackbar.color = 'green';
					}, 2500);
				}
			} catch (error) {
				setTimeout(() => {
					this.loading = false;
					this.snackbar.status = true;
					this.snackbar.message = error.response.data.message;
					this.snackbar.color = 'red';
				}, 2500);
			}
		},
	},
};
</script>

<style scoped>
.v-input--horizontal {
	margin-bottom: 0.8rem;
}
.section-login {
	height: 100vh;
	background-color: #eaeff4;
	display: flex;
	align-items: center;
	justify-content: center;
}

.form-container {
	padding: 1.2rem;
}
.login-title {
	display: flex;
	justify-content: flex-start;
}
.login-logo {
	width: 20%;
}

.login-card {
	box-shadow: 0 2.4rem 4.8rem rgba(0, 0, 0, 0.15);
	border-radius: 1.8rem;
}

.login {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	justify-items: center;
	align-items: center;
}

.login-heading-primary,
.login-heading-tertiary {
	color: #333;
	text-align: left;
}

.login-heading-primary {
	font-weight: 700;
	font-size: 1.4rem;
	margin-bottom: 0.8rem;
	letter-spacing: -0.5px;
}

.login-heading-tertiary {
	font-weight: 400;
	font-size: 1rem;
	margin-bottom: 2.4rem;
	letter-spacing: 0.01px;
}

.login-img-container {
	width: 100%;
	height: 100%;

	background-image: linear-gradient(
			to right bottom,
			rgba(58, 101, 142, 0.35),
			rgba(30, 87, 141, 0.35)
		),
		url('../assets/login-image.jpg');
	background-size: cover;
	background-position: center;
}
.login-img {
	width: 80%;
}
.v-btn.v-btn--density-default {
	height: auto;
}

.login-btn {
	background-color: #316291;
	color: #fff;

	text-transform: capitalize;
	font-weight: 700;
	font-size: 0.8rem;
	letter-spacing: -0.05px;

	border-radius: 100px;
	width: 100%;
	padding-top: 0.8rem;
	padding-bottom: 0.8rem;

	transition: all 0.3s;
}

.login-btn:hover {
	background-color: #fff;
	color: #316291;
}

.copyright {
	color: #777;
	font-size: 0.8rem;
	font-weight: 400;
	letter-spacing: -0.05px;

	margin-top: 4.8rem;
}
</style>
