<template>
	<div class="full-height container">
		<h1>404</h1>
		<h2>Halaman tidak ditemukan!</h2>
		<a class="btn" href="/login"><span class="btn-text">Kembali ke Halaman Utama</span></a>
	</div>
</template>

<style scoped>
h1,
h2 {
	font-weight: 700;
	color: #333;
}
h1 {
	font-size: 7.2rem;
}

h2 {
	font-size: 2rem;
}
.full-height {
	min-height: 100vh !important;
}
.container {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	row-gap: 1.2rem;

	background-color: #eee;
}

@import url('https://fonts.googleapis.com/css2?family=Ropa+Sans&display=swap');
.btn,
.btn:focus,
.btn:active {
	position: relative;
	display: inline-block;
	font-family: 'Ropa Sans', sans-serif;
	font-size: clamp(1rem, 1.8vw, 1.25rem);
	font-weight: bold;
	text-decoration: none;
	text-transform: uppercase;
	color: #333;
	padding: 0 18px;
	border-radius: 0;
	border: none;
	background-repeat: no-repeat;
	background-position: center;
	background-size: cover;
	overflow: hidden;
}
.btn:before,
.btn:after {
	position: absolute;
	display: block;
	content: '';
	width: 30px;
	height: 30px;
	transform: rotate(45deg);
	z-index: 3;
}
.btn:hover:before,
.btn:hover:after {
	background-color: #333;
}
.btn:before {
	bottom: 4px;
	right: 4px;
	border-right: 3px solid #333;
}
.btn:after {
	top: 4px;
	left: 4px;
	border-left: 3px solid #333;
}
.btn .btn-text,
.btn:focus .btn-text,
.btn:active .btn-text {
	color: #333;
}
.btn .btn-text,
.btn:hover .btn-text {
	position: relative;
	display: block;
	line-height: 1;
	padding: 1.25rem 1.5rem;
	border-top: 3px solid #333;
	border-bottom: 3px solid #333;
	z-index: 3;
}
.btn:hover .btn-text {
	color: #eee;
	background-color: #333;
}
.btn .btn-text:before,
.btn .btn-text:after {
	display: block;
	position: absolute;
	content: '';
	width: 20px;
	height: calc(100% - 13px);
	z-index: 3;
}
.btn:hover .btn-text:before,
.btn:hover .btn-text:after {
	background-color: #333;
}
.btn .btn-text:before {
	left: -18px;
	bottom: -3px;
	border-bottom: 3px solid #333;
	border-left: 3px solid #333;
}
.btn .btn-text:after {
	top: -3px;
	right: -18px;
	border-top: 3px solid #333;
	border-right: 3px solid #333;
}
</style>
