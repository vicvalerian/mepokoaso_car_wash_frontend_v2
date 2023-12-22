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
	computed: {
		snackbarModel: {
			get() {
				return this.status;
			},
		},
	},
};
</script>

<style scoped></style>
