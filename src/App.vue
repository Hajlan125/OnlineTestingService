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
						<div><b-button @click="showQuestionAdd(node.q_id)" data-target="#modal" class="glyphicon glyphicon-plus-sign"></b-button>
							<b-button class="glyphicon glyphicon-pencil"></b-button></div>
					</div>
				</template>
			</vue-tree>
			<b-button @click="showModal = true"></b-button>


		</div>
		<Modal v-model="showModal" title="Modal">
			<div class="container">
				<input class="text">
				<input class="text">
			</div>
		</Modal>
	</div>

</template>

<script>
import VueTree from "@ssthouse/vue-tree-chart";
import VueModal from "@kouts/vue-modal";
export default {
	mounted() {
		this.$store.dispatch('initExpandQuestions')
	},
	components: {
		VueTree,
		'Modal': VueModal
	},
	name: 'App',
	data() {
		return {
			sampleData: this.$store.state.expandQuestions.filter(item => item.q_test_id === parseInt(this.$route.params.id) ),
			treeConfig: { nodeWidth: 120, nodeHeight: 80, levelHeight: 200 },
			showModal: false,
			q_id: 0,
		}
	},
	methods: {
		showQuestionAdd(question_id) {
			this.showModal = true;
			this.q_id = question_id;
		}

	}
}
</script>

<style scoped>
.modal-content {
	display: block;
}
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
