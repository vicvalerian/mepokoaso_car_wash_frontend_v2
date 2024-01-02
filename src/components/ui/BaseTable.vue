<template>
	<v-sheet class="d-flex flex-column pa-2">
		<div class="d-flex mb-4">
			<v-spacer></v-spacer>
			<v-spacer></v-spacer>
			<div class="ms-auto flex-grow-1 flex-shrink-0" style="min-width: 100px; max-width: 100%">
				<v-form @submit.prevent="xSearch()">
					<v-text-field
						:placeholder="'Masukkan minimal 3 kata kunci lalu tekan `Enter`'"
						class="textfield--search"
						v-model="keyword"
						append-inner-icon="mdi-magnify"
						variant="underlined"
						single-line
						hide-details></v-text-field>
				</v-form>
			</div>
		</div>
		<div class="flex-1-1-100">
			<v-data-table
				:headers="list.headers"
				:items="list.datas"
				:loading="list.loading"
				item-value="name"
				hover>
				<template
					v-for="(header, index) in list.headers"
					:key="index"
					v-slot:[`item.${header.value}`]="{ item }">
					<td>
						<template v-if="header.type == 'number'">
							{{
								list.datas.indexOf(item) +
								1 +
								((list.paginate.currentPage - 1) * list.paginate.rowsPerPage || 0)
							}}
						</template>
						<template v-else-if="header.type == 'image'">
							<!-- Conditional rendering for image columns -->
							<img
								v-if="item[header.value]"
								:src="item[header.value]"
								alt="Image"
								width="50"
								height="50" />
							<span v-else>No Image</span>
						</template>
						<template v-else-if="header.type == 'actions'">
							<!-- Conditional rendering for action columns -->
							<v-tooltip
								v-for="(action, idx) in item.actions"
								:key="idx"
								:text="action.title"
								location="bottom">
								<template v-slot:activator="{ props }">
									<v-icon v-bind="props" @click="handleActionClick(action, item)" color="#555">
										{{ action.icon }}
										<v-tooltip activator="parent" location="bottom">{{ action.title }}</v-tooltip>
									</v-icon>
								</template>
							</v-tooltip>
						</template>
						<template v-else>
							<!-- Render other column types -->
							{{ item[header.value] }}
						</template>
					</td>
				</template>
				<template v-slot:loading>
					<v-skeleton-loader type="table-row@10"></v-skeleton-loader>
				</template>
				<template v-slot:bottom>
					<div class="pagination">
						<span class="pagination-rowperpage"
							>Menampilkan &nbsp;
							<v-select
								class="data-row-input"
								v-model="rowsPerPage"
								:items="rowPerPage"
								item-value="value"
								variant="underlined" />
							&nbsp; data dari {{ list.paginate.from || '0' }} - {{ list.paginate.to || '0' }} dari
							{{ list.paginate.total }}
						</span>
						<v-pagination
							@prev="list.paginate.goToPrev"
							@input="list.paginate.goToPage"
							@next="list.paginate.goToNext"
							v-model="currentPage"
							:length="list.paginate.lastPage"
							:total-visible="7"></v-pagination>
					</div>
				</template>
				<template v-slot:no-data>
					<p class="no-data-text">Maaf, tidak ada data tersedia.</p>
				</template>
			</v-data-table>
		</div>
	</v-sheet>
</template>

<script>
import { watch } from 'vue';
import { computed } from 'vue';

export default {
	props: {
		list: {
			type: Object,
			required: true,
		},
	},
	emits: ['update:currentPage', 'update:rowsPerPage', 'action-click', 'xSearch'],
	setup(props, { emit }) {
		const currentPage = computed({
			get() {
				return props.list.paginate.currentPage;
			},
			set(value) {
				emit('update:currentPage', value);
			},
		});

		const rowsPerPage = computed({
			get() {
				return props.list.paginate.rowsPerPage;
			},
			set(value) {
				emit('update:rowsPerPage', value);
			},
		});

		const updatePage = (page) => {
			currentPage.value = page;
		};

		// Watch for changes in the currentPage prop
		watch(
			() => props.list.paginate.currentPage,
			(newValue) => {
				currentPage.value = newValue;
			}
		);

		return {
			currentPage,
			rowsPerPage,
			updatePage,
		};
	},
	data() {
		return {
			rowPerPage: [10, 20, 25, 50, 100],
			toPage: 0,
			keyword: '',
		};
	},
	methods: {
		submit() {
			this.list.paginate.goToPage(this.toPage);
		},
		handleActionClick(action, item) {
			this.$emit('action-click', { action, item });
		},
		xSearch() {
			const query = this.keyword;
			this.$emit('xSearch', { query });
		},
	},
};
</script>

<style>
.v-data-table th {
	font-weight: 700 !important;
	font-size: 0.9rem;
	letter-spacing: 0.05px;
	color: #fff;
	background-color: #2c5883;
}

.v-data-table th:hover {
	color: #ccc !important;
}

.v-table {
	border-radius: 10px;
}

.no-data-text {
	font-size: 0.9rem;
	font-weight: 700;
	color: #e03131;
}

.pagination {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-end;
}

.pagination-rowperpage {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	margin-right: 2rem;
}

.data-row-input {
	width: 50px;
	display: inline-block;
	font-size: 12px !important;
}

.v-select .v-select__selection-text {
	font-size: 0.8rem;
}

.textfield--search {
	font-size: 12px !important;
}
</style>
