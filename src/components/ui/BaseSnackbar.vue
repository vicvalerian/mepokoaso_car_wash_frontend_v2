<template>
	<v-snackbar v-model="snackbarModel" :color="color" timeout="2500">
		{{ message }}
	</v-snackbar>
</template>

<script>
export default {
	props: {
		status: {
			type: Boolean,
			default: false,
		},
		message: {
			type: String,
			required: true,
			default: '',
		},
		color: {
			type: String,
			required: true,
			default: '',
		},
	},
	data() {
		return {
			snackbarModel: false,
		};
	},
	watch: {
		status(val) {
			this.snackbarModel = val;
		},
	},
};
</script>

<style scoped></style>
