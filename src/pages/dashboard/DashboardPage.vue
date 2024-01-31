<template>
	<v-main>
		<v-overlay :model-value="overlay" class="align-center justify-center">
			<img src="@/assets/loading.svg" height="150" />
		</v-overlay>
		<div class="pages--container">
			<div class="page-title-container mb-4">
				<h1 class="pages--title">Dashboard</h1>
			</div>
			<div class="dashboard-content-grid--5 mb-8">
				<v-card elevation="0" @click="goToPage('laporan')">
					<v-card-title class="sumcard-title mb-2 mb-2">Pendapatan Pencucian</v-card-title>
					<v-card-text class="sumcard-text">
						{{ formatRupiah(sumCard.pencucianIncome, 'Rp') }}
					</v-card-text>
				</v-card>
				<v-card elevation="0" @click="goToPage('laporan')">
					<v-card-title class="sumcard-title mb-2">Pendapatan Kedai</v-card-title>
					<v-card-text class="sumcard-text">
						{{ formatRupiah(sumCard.kedaiIncome, 'Rp') }}
					</v-card-text>
				</v-card>
				<v-card elevation="0" @click="goToPage('transaksi pencucian')">
					<v-card-title class="sumcard-title mb-2">Total Kendaraan Belum Lunas</v-card-title>
					<v-card-text class="sumcard-text">
						{{ sumCard.kendaraanUnpaid }}
					</v-card-text>
				</v-card>
				<v-card elevation="0" @click="goToPage('transaksi pencucian')">
					<v-card-title class="sumcard-title mb-2">Total Kendaraan Bulan Ini</v-card-title>
					<v-card-text class="sumcard-text">
						{{ sumCard.kendaraanThisMonth }}
					</v-card-text>
				</v-card>
				<v-card elevation="0" @click="goToPage('karyawan')">
					<v-card-title class="sumcard-title mb-2">Total Karyawan Pencuci</v-card-title>
					<v-card-text class="sumcard-text">
						{{ sumCard.karyawan }}
					</v-card-text>
				</v-card>
			</div>
			<div class="dashboard-content-grid--2">
				<v-select
					v-model="form.bulan"
					:items="bulan_list"
					label="Bulan"
					variant="underlined"></v-select>
				<v-select
					v-model="form.tahun"
					:items="tahun_list"
					label="Tahun"
					variant="underlined"></v-select>
			</div>
			<div class="dashboard-content-grid--2 mb-8">
				<v-card>
					<v-card-title class="dashboard-card-title">Jumlah Pencucian Kendaraan</v-card-title>
					<apexchart
						width="100%"
						:options="pencucianChartOptions"
						:series="pencucianChart.series"></apexchart>
				</v-card>
				<v-card>
					<v-card-title class="dashboard-card-title">Jumlah Penjualan Kedai</v-card-title
					><apexchart width="100%" :options="kedaiChartOptions" :series="kedaiChart.series">
					</apexchart>
				</v-card>
			</div>
		</div>
	</v-main>
</template>

<style scoped>
.dashboard-content-grid--2 {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 4rem;
}
.dashboard-content-grid--5 {
	display: grid;
	grid-template-columns: repeat(5, 1fr);
	grid-template-rows: 6rem;
	gap: 1rem;
}

.sumcard-title,
.sumcard-text {
	font-size: 0.9rem;
	font-weight: 700;
	letter-spacing: -0.1px;
	color: #555;
}

.sumcard-text {
	color: #333;
	font-size: 1.4rem;

	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.dashboard-card-title {
	font-size: 1rem;
	font-weight: 700;
	letter-spacing: -0.2px;
	color: #333;
}
</style>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			userLogin: JSON.parse(localStorage.getItem('userLogin')),
			sumCard: {
				karyawan: 0,
				kendaraanThisMonth: 0,
				kendaraanUnpaid: 0,
				pencucianIncome: 0,
				kedaiIncome: 0,
			},
			bulan_list: [
				{ title: 'Januari', value: 1 },
				{ title: 'Februari', value: 2 },
				{ title: 'Maret', value: 3 },
				{ title: 'April', value: 4 },
				{ title: 'Mei', value: 5 },
				{ title: 'Juni', value: 6 },
				{ title: 'Juli', value: 7 },
				{ title: 'Agustus', value: 8 },
				{ title: 'September', value: 9 },
				{ title: 'Oktober', value: 10 },
				{ title: 'November', value: 11 },
				{ title: 'December', value: 12 },
			],
			tahun_list: [
				{ title: '2019', value: 2019 },
				{ title: '2020', value: 2020 },
				{ title: '2021', value: 2021 },
				{ title: '2022', value: 2022 },
				{ title: '2023', value: 2023 },
				{ title: '2024', value: 2024 },
				{ title: '2025', value: 2025 },
				{ title: '2026', value: 2026 },
				{ title: '2027', value: 2027 },
			],
			form: {
				bulan: new Date().getMonth() + 1,
				tahun: new Date().getFullYear(),
			},
			pencucianChart: {
				series: [
					{
						name: 'Jumlah Pencucian Kendaraan',
						data: [],
					},
				],
			},
			pencucianChartOptions: {
				noData: {
					text: 'Tidak Ada Data Tersedia',
					align: 'center',
					verticalAlign: 'middle',
					offsetX: 0,
					offsetY: 0,
				},
				colors: '#1864ab',
				chart: {
					type: 'bar',
					toolbar: {
						show: false,
					},
				},
				stroke: {
					curve: 'smooth',
				},
				labels: [],
				yaxis: {
					decimalsInFloat: 0,
					labels: {
						formatter: function (val) {
							return val.toFixed(0);
						},
					},
				},
				xaxis: {
					categories: [],
				},
			},
			kedaiChart: {
				series: [
					{
						name: 'Jumlah Penjualan Kedai',
						data: [],
					},
				],
			},
			kedaiChartOptions: {
				noData: {
					text: 'Tidak Ada Data Tersedia',
					align: 'center',
					verticalAlign: 'middle',
					offsetX: 0,
					offsetY: 0,
				},
				colors: '#1864ab',
				chart: {
					type: 'bar',
					toolbar: {
						show: false,
					},
				},
				labels: [],
				yaxis: {
					decimalsInFloat: 0,
					labels: {
						formatter: function (val) {
							return val.toFixed(0);
						},
					},
				},
			},
			overlay: true,
		};
	},
	created() {
		this.getSumKaryawan();
		this.getSumKendaraanThisMonth();
		this.getSumKendaraanUnpaid();
		this.getSumPencucianIncome();
		this.getSumKedaiIncome();

		this.refreshChart();
	},
	methods: {
		async refreshChart() {
			this.overlay = true;
			let urlPencucianChart =
				'api/chart/transaksi-pencucian?bulan=' + this.form.bulan + '&tahun=' + this.form.tahun;
			let urlKedaiChart =
				'api/chart/transaksi-kedai?bulan=' + this.form.bulan + '&tahun=' + this.form.tahun;

			await this.getPencucianChart(urlPencucianChart);
			await this.getKedaiChart(urlKedaiChart);
			setTimeout(() => {
				this.overlay = false;
			}, 300);
		},
		async getPencucianChart(url) {
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.get(url, { headers });
				if (response.status == 200) {
					const data = await response.data;
					this.filterPencucianChart(data);
				}
			} catch (error) {
				console.log(error);
			}
		},
		async getKedaiChart(url) {
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.get(url, { headers });
				if (response.status == 200) {
					const data = await response.data;
					this.filterKedaiChart(data);
				}
			} catch (error) {
				console.log(error);
			}
		},
		filterPencucianChart(data) {
			this.pencucianChart.series.length = 0;
			this.pencucianChart.series.data = [];
			this.pencucianChartOptions.labels.length = 0;

			let isNull = true;

			let dataTotal = [];
			data.forEach((element) => {
				let series = element.total;
				let label = element.formatTgl;

				dataTotal.push(series);
				this.pencucianChartOptions.labels.push(label);

				if (element.total !== 0) {
					isNull = false;
				}
			});

			let insertData = {
				name: 'Jumlah Transaksi Pencucian',
				data: dataTotal,
			};

			this.pencucianChart.series.push(insertData);

			if (isNull === true) {
				this.pencucianChart.series = [];
				this.pencucianChartOptions.labels.length = 0;
			}
		},
		filterKedaiChart(data) {
			this.kedaiChart.series.length = 0;
			this.kedaiChartOptions.labels.length = 0;
			let isNull = true;

			let dataTotal = [];
			data.forEach((element) => {
				let series = element.total;
				let label = element.formatTgl;

				dataTotal.push(series);
				this.kedaiChartOptions.labels.push(label);

				if (element.total !== 0) {
					isNull = false;
				}
			});

			let insertData = {
				name: 'Jumlah Transaksi Penjualan',
				data: dataTotal,
			};
			this.kedaiChart.series.push(insertData);

			if (isNull === true) {
				this.kedaiChart.series = [];
				this.kedaiChartOptions.labels.length = 0;
			}
		},
		async getSumKaryawan() {
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.get('api/dashboard/karyawan', { headers });
				if (response.status == 200) {
					this.sumCard.karyawan = response.data;
				}
			} catch (error) {
				console.log(error);
			}
		},
		async getSumKendaraanThisMonth() {
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.get('api/dashboard/kendaraan-month', { headers });
				if (response.status == 200) {
					this.sumCard.kendaraanThisMonth = response.data;
				}
			} catch (error) {
				console.log(error);
			}
		},
		async getSumKendaraanUnpaid() {
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.get('api/dashboard/kendaraan-unpaid', { headers });
				if (response.status == 200) {
					this.sumCard.kendaraanUnpaid = response.data;
				}
			} catch (error) {
				console.log(error);
			}
		},
		async getSumPencucianIncome() {
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.get('api/dashboard/pencucian-month-income', { headers });
				if (response.status == 200) {
					this.sumCard.pencucianIncome = response.data;
				}
			} catch (error) {
				console.log(error);
			}
		},
		async getSumKedaiIncome() {
			try {
				const headers = {
					Authorization: `Bearer ${this.userLogin.token}`,
				};

				const response = await axios.get('api/dashboard/kedai-month-income', { headers });
				if (response.status == 200) {
					this.sumCard.kedaiIncome = response.data;
				}
			} catch (error) {
				console.log(error);
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
		goToPage(to) {
			switch (to) {
				case 'laporan':
					this.$router.push('/laporan');
					break;
				case 'transaksi pencucian':
					this.$router.push('/transaksi-pencucian');
					break;
				case 'karyawan':
					this.$router.push('/karyawan');
					break;

				default:
					break;
			}
		},
	},
	watch: {
		'form.bulan'() {
			this.overlay = true;
			this.refreshChart();
		},

		'form.tahun'() {
			this.overlay = true;
			this.refreshChart();
		},
	},
};
</script>
