<template>
	<div>
		<v-app-bar color="#42A5F5" flat height="150px" tile>
			<h1 class="title1">Система Онлайн Тестирования</h1>
			<v-spacer></v-spacer>
			<ul>
				<li>
					<v-toolbar-title class="user-title">{{currentUser.user_name}}</v-toolbar-title>
				</li>
				<li>
					<b-button @click="logout" variant="danger" size="md" class="mb-2">
						<b-icon icon="box-arrow-right" aria-hidden="true"></b-icon>
						Выйти
					</b-button>
				</li>
			</ul>
		</v-app-bar>
		<v-app-bar color="#E6EEFF" flat height="50px" tile>
			<b-button @click="$router.push({name: 'tests_list'})" pill>Вернуться к списку</b-button>
			<b-button pill @click="$router.push({name: 'home'})">Вернуться на главную страницу</b-button>
		</v-app-bar>
		<div class="container">
			<div class="container">
				<h1>Тест {{parseInt(this.$route.params.id)}}</h1>
				<b-button variant="primary" v-show="isNew" v-b-modal.modal-prevent-closing @click="showFirstQuestionAdd">Добавить первый вопрос</b-button>
				<b-button-toolbar>
					<b-button-group>
						<b-button @click="zoomOut" variant="outline-secondary" class="glyphicon glyphicon-minus"></b-button>
						<b-button disabled variant="outline-secondary">ZOOM</b-button>
						<b-button @click="zoomIn" variant="outline-secondary" class="glyphicon glyphicon-plus"></b-button>
					</b-button-group>
				</b-button-toolbar>
			</div>
			<vue-tree
				ref="tree"
				style="width: 1000px; height: 600px; border: 1px solid gray;"
				:dataset="questionList"
				:config="treeConfig"
				linkStyle="straight"
			>
				<template v-slot:node="{ node, collapsed }">
					<div
						class="rich-media-node"
						:style="{ border: collapsed ? '2px solid grey' : '' }"
					>

						<span style="padding: 5px 0; font-weight: bold;">
							{{ node.q_title }}
						</span>
						<span style="padding: 5px 0; font-weight: bold;">
							Количество ответов: {{node.answers.length}}
						</span>
						<b-button-group>
							<b-button v-b-modal.modal-prevent-closing @click="showQuestionAdd(node.q_id)" class="glyphicon glyphicon-plus-sign"></b-button>
							<b-button class="glyphicon glyphicon-pencil" @click="$router.push({path: `/test/${q_test_id}/question/${node.q_id}`})"></b-button>
							<b-button class="glyphicon glyphicon-trash" @click="handleDelete($event, node.q_id, node.q_parent_id)" ></b-button>
						</b-button-group>
					</div>
				</template>
			</vue-tree>



		</div>
		<div class="mt-3">
			<b-modal
				id="modal-prevent-closing"
				ref="modal"
				no-fade
				@hidden="resetModal"
				@ok="handleSubmit"
				title="Введите текст вопроса"
			>
				<form ref="form">
					<b-form-group
						label="Вопрос"
						label-for="name-input"
						invalid-feedback="Обязательно необходимо ввести текст вопроса"
					>
						<b-form-input
							id="name-input"
							class="text"
							v-model="q_title"
							required
						></b-form-input>
					</b-form-group>
				</form>
			</b-modal>
		</div>
	</div>
</template>

<script>
import VueTree from "@ssthouse/vue-tree-chart";
import {authenticationService} from "../authentication.service";
export default {
	created() {
		this.$store.dispatch('initQuestions')
		this.$store.dispatch('initExpandQuestions')
	},
	mounted() {
		this.$store.dispatch('initQuestions')
		this.$store.dispatch('initExpandQuestions')
	},
	updated() {

	},

	components: {
		VueTree
	},
	name: 'TreeTestPage',
	data() {
		return {
			currentUser: authenticationService.currentUserValue,
			sampleData: this.$store.state.expandQuestions.filter(item => item.q_test_id === parseInt(this.$route.params.id) ),
			treeConfig: { nodeWidth: 200, nodeHeight: 200, levelHeight: 300 },
			showModal: false,
			question_item: null,
			q_parent_id: 0,
			q_title: "",
			q_test_id: parseInt(this.$route.params.id),
			q_chance: 0,
			q_child_chances: 0,
			name: "",
			clicked: false
		}
	},
	methods: {
		logout() {
			authenticationService.logout()
			this.$router.push({name: 'login'})
		},
		updateDataset() {
			return this.$store.state.expandQuestions.filter(item => item.q_test_id === parseInt(this.$route.params.id) )
		},
		zoomIn() {
			this.$refs.tree.zoomIn()
		},
		zoomOut() {
			this.$refs.tree.zoomOut()
		},
		calculateChances(q_id) {
			const array_length = this.$store.state.questions.filter(item => item.q_parent_id === q_id).length;
			if (array_length === 0) {
				this.q_child_chances = 100
			} else {
				this.q_child_chances = Math.floor(100/(array_length+1))
			}
		},
		calculateChancesOnDelete(q_id) {
			const array_length = this.$store.state.questions.filter(item => item.q_parent_id === q_id).length;
			if (array_length === 0) {
				return 100
			} else {
				try {
					return Math.floor(100/(array_length-1))
				} catch (e) {
					return 100
				}
			}
		},
		alerts() {
			alert(this.isNew)
		},
		showQuestionAdd(question_id) {
			this.calculateChances(question_id)
			this.showModal = true;
			this.q_parent_id = question_id;
			this.question_item = {
				q_title: "",
				q_parent_id: question_id,
				q_test_id: this.q_test_id,
				q_chance: this.q_child_chances
			}
		},
		showFirstQuestionAdd() {
			this.showModal = true;
			this.question_item = {
				q_title: "",
				q_test_id: this.q_test_id,
				q_chance: 100
			}
		},
		resetModal() {
			this.q_parent_id = 0
			this.q_chance = 0
			this.q_child_chances = 0
		},
		checkFormValidity() {
			const valid = this.$refs.form.checkValidity()
			let check = this.q_title
			check = valid
			return valid
		},
		// async handleOk(bvModalEvent) {
		// 	// Предотвратить закрытие модального окна
		// 	bvModalEvent.preventDefault()
		// 	// Обработчик отправки триггера
		// 	this.handleSubmit()
		// },
		async familyChancesEditing(q_id, q_chance) {
			const array = this.$store.state.questions.filter(item => item.q_parent_id === q_id);
			if (array.length === 0) {
				return
			}
			var index, len
			for (index = 0, len = array.length; index < len; ++index) {
				const q_item = {
					q_id: array[index].q_id,
					q_chance: q_chance
				}
				await this.$store.dispatch('editQuestionItem', q_item);
			}
		},
		async handleSubmit(e) {
			e.preventDefault()
			// Выйти, если форма недействительна
			if (!this.checkFormValidity()) {
				return
			}
			this.question_item.q_title = this.q_title;
			await this.$store.dispatch('addQuestionItem', this.question_item);
			//Функция для изменения всех предыдущих вопросов
			await this.familyChancesEditing(this.question_item.q_parent_id, this.question_item.q_chance)
			// await this.$store.dispatch('initQuestions')
			// await this.$store.dispatch('initExpandQuestions')
			await this.$router.go();
			// Скрыть модальное окно вручную
			this.$nextTick(() => {
				this.$bvModal.hide('modal-prevent-closing')
			})
		},
		async handleSubmitNew(e) {

		},
		async handleDelete(e, id, parent_id) {
			e.preventDefault();

			const chance = this.calculateChancesOnDelete(parent_id);
			await this.familyChancesEditing(parent_id, chance);
			await this.$store.dispatch("removeQuestionItem", id);
			await this.$store.dispatch("initQuestions");
			await this.$store.dispatch("initExpandQuestions");
			await this.$router.go();
		}
	},
	computed: {
		questionList() {
			return this.$store.state.expandQuestions.filter(item => item.q_test_id === parseInt(this.$route.params.id) )
		},
		isNew() {
			return this.$store.state.questions
				.filter(item => item.q_test_id === parseInt(this.$route.params.id)).length === 0;
		},
		dataSet() {
			if (this.clicked) {
				return this.$store.state.expandQuestions.filter(item => item.q_test_id === parseInt(this.$route.params.id) )
			}
			return this.$store.state.expandQuestions.filter(item => item.q_test_id === parseInt(this.$route.params.id) )
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
	width: 2000px;
}

.rich-media-node {
	width: 127px;
	padding: 8px;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	justify-content: center;
	color: white;
	background-color: #0a68b4;
	border-radius: 4px;
}
.title1 {
	font-size: 50px;
	font-weight: bold;
	color: #FFFFFF;
	text-shadow:
		-0 -3px 5px #000000,
		0 -3px 5px #000000,
		-0 3px 5px #000000,
		0 3px 5px #000000,
		-3px -0 5px #000000,
		3px -0 5px #000000,
		-3px 0 5px #000000,
		3px 0 5px #000000,
		-1px -3px 5px #000000,
		1px -3px 5px #000000,
		-1px 3px 5px #000000,
		1px 3px 5px #000000,
		-3px -1px 5px #000000,
		3px -1px 5px #000000,
		-3px 1px 5px #000000,
		3px 1px 5px #000000,
		-2px -3px 5px #000000,
		2px -3px 5px #000000,
		-2px 3px 5px #000000,
		2px 3px 5px #000000,
		-3px -2px 5px #000000,
		3px -2px 5px #000000,
		-3px 2px 5px #000000,
		3px 2px 5px #000000,
		-3px -3px 5px #000000,
		3px -3px 5px #000000,
		-3px 3px 5px #000000,
		3px 3px 5px #000000,
		-3px -3px 5px #000000,
		3px -3px 5px #000000,
		-3px 3px 5px #000000,
		3px 3px 5px #000000;
}
.user-title {
	font-family: Arial, Helvetica, sans-serif;
	font-size: 25px;
	letter-spacing: -0.6px;
	word-spacing: -0.4px;
	color: #FFFFFF;
	color: #FFFFFF;
	text-shadow:
		2px 2px 2px #000000;
	font-weight: 400;
	text-decoration: overline;
	font-style: normal;
	font-variant: normal;
	text-transform: capitalize;
}
li {
	list-style-type: none;
	display: inline-flex;
	padding: 5px;
	margin: 5px;
}
</style>
