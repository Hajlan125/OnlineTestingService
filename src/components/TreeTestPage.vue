<template>
	<div>
		<b-button class="left" @click="$router.push({name:'tests_list'})">Назад</b-button>
	<div class="container">
		<div class="container">
			<h1>Тест {{parseInt(this.$route.params.id)}}</h1>
		</div>
		<vue-tree
			style="width: 1000px; height: 600px; border: 1px solid gray;"
			:dataset="sampleData"
			:config="treeConfig"
		>
			<template v-slot:node="{ node, collapsed }">
				<div
					class="rich-media-node"
					:style="{ border: collapsed ? '2px solid grey' : '' }"
				>

          <span style="padding: 10px 0; font-weight: bold;"
					>{{ node.q_title }}</span
					>
					<div><b-button @click="showModal = true" class="glyphicon glyphicon-plus-sign"></b-button>
						<b-button class="glyphicon glyphicon-pencil"></b-button></div>
				</div>
			</template>
		</vue-tree>
		<vue-final-modal v-model="showModal" classes="modal-container" content-class="modal-content">
			<h1 class="modal__title">Hello world</h1>
			<input class="text">
			<b-button @click="showModal = false">Закрыть</b-button>
		</vue-final-modal>
	</div>
	</div>
</template>

<script>
import VueTree from "@ssthouse/vue-tree-chart";

export default {
	mounted() {
		this.$store.dispatch('initExpandQuestions')
	},
	components: {
		VueTree
	},
	name: 'TreeTestPage',
	data() {
		return {
			sampleData: this.$store.state.expandQuestions.filter(item => item.q_test_id === parseInt(this.$route.params.id) ),

			treeConfig: { nodeWidth: 120, nodeHeight: 80, levelHeight: 200 },
			showModal: false
		}
	},
	methods: {

	}
}
</script>

<style scoped>
.container {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 1000px;
}

.rich-media-node {
	width: 105px;
	padding: 8px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	color: white;
	background-color: #0a68b4;
	border-radius: 4px;
}
</style>
