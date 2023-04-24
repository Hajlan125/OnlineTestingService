<template>
	<div>
		<appbar></appbar>
		<div class="container">
			<div class="container">
				<h1>Тест {{parseInt(this.$route.params.id)}}</h1>
				<button class="btn-add" v-show="isNew" v-b-modal.modal-prevent-closing @click="showFirstQuestionAdd">Добавить первый вопрос</button>
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
					<div class="rich-media-node" :style="{ border: collapsed ? '2px solid grey' : '' }">
						<span style="padding: 5px 0; font-weight: bold;">
							{{ node.q_title }}
						</span>
						<span style="padding: 5px 0; font-weight: bold;">
							{{question_types_list.find(item => item.type_q_id === node.q_type).type_q}}
						</span>
						<b-button-group>
							<b-button v-b-modal.modal-prevent-closing @click="showQuestionAdd(node.q_id)" class="glyphicon glyphicon-plus-sign"></b-button>
							<b-button class="glyphicon glyphicon-pencil" @click="show_question_modal(node.q_id, node.q_type)"></b-button>
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
						label="Вопрос" label-for="name-input"
						invalid-feedback="Обязательно необходимо ввести текст вопроса"
					>
						<b-form-input id="name-input" class="text" v-model="q_title" required>
						</b-form-input>
					</b-form-group>
					<b-form-group label="Тип вопроса" label-for="type-input">
						<b-form-select id="type-input" :options="question_types_list" v-model="question_item.q_type"
													 text-field="type_q" value-field="type_q_id">

						</b-form-select>
					</b-form-group>
				</form>
			</b-modal>
		</div>
		<div class="q-modal">
			<b-modal
				id="question-modal"
				ref="question-modal"
				no-fade
				title="Редактирование вопроса"
			>
				<template #modal-header="{ close }">
					<!-- Эмулировать встроенное модальное действие кнопки закрытия заголовка -->
					<b>Редактирование вопроса</b>
				</template>
				<template #default>
					<b-form @submit="handle_submit_new_question" id="add-q-form">
						<b-form-group label="Текст вопроса"
													label-for="question-text-input">
							<b-form-input required class="style-input" id="question-text-input"
														v-model="question_item.q_title"
														placeholder="Введите текст вопроса" >
							</b-form-input>
						</b-form-group>
						<b-form-group label="Тип вопроса" label-for="q-type-selector">
							<b-form-select id="q-type-selector" v-model="question_item.q_type"
														 :options="question_types_list" value-field="type_q_id" text-field="type_q"></b-form-select>
						</b-form-group>
					</b-form>
				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
					<b-button size="sm" variant="outline-success" form="add-q-form" type="submit">
						Сохранить
					</b-button>
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Выход
					</b-button>
				</template>
			</b-modal>
		</div>
		<div class="comparison-answer-modal">
			<b-modal
				id="comparison-answer-modal"
				ref="comparison-answer-modal"
				no-fade
				title="Редактирование ответа"
			>
				<template #modal-header="{ close }">
					<!-- Эмулировать встроенное модальное действие кнопки закрытия заголовка -->
					<b>Редактирование ответа</b>
				</template>
				<template #default>
					<b-form>
						<b-form-group label="Первая часть"
													label-for="answer-text-1-input">
							<b-form-input class="style-input"  id="answer-text-1-input" v-model="answer_item.answ_text"
														placeholder="Введите текст ответа" required>

							</b-form-input>
						</b-form-group>
						<b-form-group label="Вторая часть"
													label-for="answer-text-2-input">
							<b-form-input class="style-input"  id="answer-text-2-input" v-model="answer_item.answ_comparison_text"
														placeholder="Введите текст ответа" required>

							</b-form-input>
						</b-form-group>
					</b-form>

				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
					<b-button size="sm" variant="outline-success" @click="handleSubmitAnswer($event)">
						Сохранить
					</b-button>
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Выход
					</b-button>
				</template>
			</b-modal>
		</div>
		<div class="edit-standard-question-modal">
			<b-modal
				id="edit-standard-question-modal" ref="edit-standard-question-modal" no-fade
				title="Редактирование вопроса" size="lg"
			>
				<template #modal-header="{ close }">
					<!-- Эмулировать встроенное модальное действие кнопки закрытия заголовка -->
					<b>Редактирование вопроса</b>
				</template>
				<template #default>
					<div>
						<b-form-group label="Текст вопроса"
													label-for="question-text-input">
							<b-form-input @blur="handle_submit_edited_standard_question($event)" id="question-text-input"
														v-model="edit_question_item.q_title"
														class="style-input"
														placeholder="Введите текст вопроса" required>
							</b-form-input>
						</b-form-group>

						<b-form id="add-answ-form" @submit="handle_submit_answer($event, selected_question_id)" inline>
							<b-input required v-model="new_answer_item.answ_text" class="style-input" placeholder="Добавление ответа"></b-input>
							<b-form-checkbox size="lg" switch button-variant="outline-primary" class="standard-answ-correct-switch"
															 v-model="new_answer_item.is_correct">Правильный?</b-form-checkbox>
							<b-button type="submit">Добавить</b-button>
						</b-form>
						<b-form-group>
							<b-table
								id = "answer-table" fixed
								:items="filtered_answer_items"
								:fields="answer_fields"
								responsive="sm"
							>
								<template #cell(answ_text)="data">
									<div>
										<b-form-group>
											<b-form-input class="style-input"
																		@blur="handle_submit_filtered_answer(data.item.answ_id)"
																		v-model="filtered_answer_items.find(item => item.answ_id === data.item.answ_id).answ_text">
											</b-form-input>
										</b-form-group>
									</div>
								</template>
								<template #cell(is_correct)="data">
									<b-form-checkbox size="lg" @change="handle_submit_filtered_answer(data.item.answ_id)"
																	 v-model="filtered_answer_items.find(item => item.answ_id === data.item.answ_id).is_correct"></b-form-checkbox>
								</template>
								<template #cell(delete)="data">
									<div>
										<b-button @click="show_ans_delete_msg_box($event, data.item.answ_id)">Удалить</b-button>
									</div>
								</template>
							</b-table>
						</b-form-group>
					</div>
				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Выход
					</b-button>
				</template>
			</b-modal>
		</div>
		<div class="comparison-question-modal">
			<b-modal
				id="comparison-question-modal" ref="comparison-question-modal" no-fade
				title="Редактирование вопроса" size="lg"
			>
				<template #modal-header="{ close }">
					<!-- Эмулировать встроенное модальное действие кнопки закрытия заголовка -->
					<b>Редактирование вопроса</b>
				</template>
				<template #default>
					<b-form>
						<b-form-group label="Текст вопроса"
													label-for="question-text-input">
							<b-form-input class="style-input" id="question-text-input" v-model="edit_question_item.q_title"
														placeholder="Введите текст вопроса" required>
							</b-form-input>
						</b-form-group>
						<p1>Добавление ответа</p1>
						<b-input-group>
							<b-input placeholder="Первая часть" class="style-input" v-model="new_answer_item.answ_text">Первая часть</b-input>
							<b-input placeholder="Вторая часть" class="style-input" v-model="new_answer_item.answ_comparison_text">Вторая часть</b-input>
							<b-button @click="handle_submit_answer($event, selected_question_id)">Добавить</b-button>
						</b-input-group>
						<b-form-group>
							<b-table
								id = "answer-table" fixed
								:items="filtered_answer_items"
								:fields="comparison_answer_fields"
								responsive="sm"
							>
								<template #cell(answ_text)="data">
									<div>
										<b-form-group>
											<b-form-input class="style-input"
																		v-model="filtered_answer_items.find(item => item.answ_id === data.item.answ_id).answ_text">
											</b-form-input>
										</b-form-group>
									</div>
								</template>
								<template #cell(answ_comparison_text)="data">
									<div>
										<b-form-group>
											<b-form-input class="style-input"
																		v-model="filtered_answer_items.find(item => item.answ_id === data.item.answ_id).answ_comparison_text">
											</b-form-input>
										</b-form-group>
									</div>
								</template>
								<template #cell(delete)="data">
									<div>
										<b-button @click="handleRemoveAnswers($event, data.item.answ_id)">Удалить</b-button>
									</div>
								</template>
							</b-table>
						</b-form-group>
					</b-form>
				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
					<b-button size="sm" variant="outline-success" @click="handle_submit_edited_standard_question($event)">
						Сохранить
					</b-button>
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Выход
					</b-button>
				</template>
			</b-modal>
		</div>
		<div class="edit-open-question-modal">
			<b-modal
				id="edit-open-question-modal" ref="edit-open-question-modal" no-fade
				title="Редактирование вопроса" size="lg" @hide="on_hide_standard_question_modal"
			>
				<template #modal-header="{ close }">
					<!-- Эмулировать встроенное модальное действие кнопки закрытия заголовка -->
					<b>Редактирование вопроса</b>
				</template>
				<template #default>
					<div>
						<b-form-group label="Текст вопроса"
													label-for="question-text-input">
							<b-form-input @blur="handle_submit_edited_standard_question($event)" id="question-text-input"
														v-model="edit_question_item.q_title"
														class="style-input"
														placeholder="Введите текст вопроса" required>
							</b-form-input>
						</b-form-group>

						<b-input required @blur="handle_submit_filtered_answer(filtered_answer_items.find(item => item.answ_question_id === selected_question_id).answ_id)"
										 v-model="filtered_answer_items.find(item => item.answ_question_id === selected_question_id).answ_text"
										 class="style-input" placeholder="Открытый ответ"></b-input>

					</div>
				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Выход
					</b-button>
				</template>
			</b-modal>
		</div>
	</div>
</template>

<script>
// import VueTree from "@ssthouse/vue-tree-chart";
import {authenticationService} from "../authentication.service";
import {Question_Types} from "../utils";
export default {
	created() {
		// this.$store.dispatch('initQuestions')
		// this.$store.dispatch('initExpandQuestions')
	},
	mounted() {
		this.$store.dispatch('initQuestions')
		this.$store.dispatch('initExpandQuestions')
		this.$store.dispatch('initAnswers')

		this.$store.dispatch('initQuestionTypes')

	},

	components: {
		// VueTree
	},
	name: 'TreeTestPage',
	data() {
		return {
			clicked: false,
			multiRoot1: [
				{
					name: 'Wheels',
					children: [
						{
							name: 'Wings',
							children: [
								{
									name: 'Plane'
								}
							]
						}
					]
				},
				{
					name: 'Wings',
					children: [
						{
							name: 'Plane'
						}
					]
				}
			],
			multiRoot2: {
				name: 'Carburetor',
				children: [
					{
						name: 'Truck',
						customID: 2
					},
					{
						name: 'Car',
						customID: 2
					}
				]
			},
			data_set: [],
			Question_Types,
			selected_question_id: 0,
			// standard_answers_items: [],
			answer_fields: ['answ_id', 'answ_text', 'is_correct', 'delete'],
			comparison_answer_fields: ['answ_id', 'answ_text', 'answ_comparison_text', 'delete'],
			currentUser: authenticationService.currentUserValue,
			sampleData: this.$store.state.expandQuestions.filter(item => item.q_test_id === parseInt(this.$route.params.id) ),
			treeConfig: { nodeWidth: 200, nodeHeight: 200, levelHeight: 300 },
			showModal: false,
			answer_item: {
				answ_id: 0,
				answ_text: "",
				answ_question_id: 0,
				is_correct: false,
				answ_comparison_text: ""
			},
			question_item: {
				q_id: 0,
				q_title: "",
				q_test_id: parseInt(this.$route.params.id),
				q_connection_id: null,
				q_type: 1,
				q_parallel_block_id: null
			},
			q_parent_id: 0,
			q_title: "",
			q_test_id: parseInt(this.$route.params.id),
			q_chance: 0,
			q_child_chances: 0,
			name: "",
			new_standard_answer_item: {
				answ_id: 0,
				answ_text: "",
				answ_question_id: 0,
				is_correct: false
			},
			edit_question_item: {
				q_id: 0,
				q_title: ""
			},
			edit_comparison_answer_item: {
				answ_id: 0,
				answ_text: "",
				answ_comparison_text: "",
				is_correct: true,
				answ_question_id: 0
			},
			new_comparison_answer_item: {
				answ_id: 0,
				answ_text: "",
				answ_comparison_text: "",
				is_correct: true,
				answ_question_id: 0
			},
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

		alerts() {
			alert("smth")
		},
		showQuestionAdd(question_id) {
			this.showModal = true;
			this.q_parent_id = question_id;
			this.question_item = {
				q_title: "",
				q_parent_id: question_id,
				q_test_id: this.q_test_id,
			}
		},
		show_question_modal(q_id, q_type) {
			this.selected_question_id = q_id

			// const item = this.$store.state.questions.find(item => item.q_id === q_id)
			// this.edit_question_item = {
			// 	q_id: q_id,
			// 	q_title: item.q_title
			// }
			this.question_item = this.$store.state.questions.find(item => item.q_id === q_id)
			// this.standard_answers_items = this.answersList.filter(item => item.answ_question_id === q_id)
			// this.$bvModal.show('modal-prevent-closing')
			switch (q_type){
				case Question_Types.Standard:
					this.$bvModal.show('question-modal')
					break
				case Question_Types.Open_answer:
					break
				case Question_Types.Comparison:
					this.$bvModal.show('comparison-question-modal')
					break
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
			this.question_item = {
				q_title: "",
				q_type: 1
			}

		},
		checkFormValidity() {
			const valid = this.$refs.form.checkValidity()
			let check = this.q_title
			check = valid
			return valid
		},
		async handleSubmit(e) {
			e.preventDefault()
			// Выйти, если форма недействительна
			if (!this.checkFormValidity()) {
				return
			}
			this.question_item.q_title = this.q_title;
			await this.$store.dispatch('addQuestionItem', this.question_item);

			// //Функция для изменения всех предыдущих вопросов
			// await this.familyChancesEditing(this.question_item.q_parent_id, this.question_item.q_chance)
			// await this.$store.dispatch('initQuestions')
			// await this.$store.dispatch('initExpandQuestions')

			// await this.$router.go();
			this.$refs.tree.draw()
			// Скрыть модальное окно вручную
			this.$nextTick(() => {
				this.$bvModal.hide('modal-prevent-closing')
			})
		},
		async handle_submit_edited_standard_question(e) {
			e.preventDefault()

			await this.$store.dispatch('editQuestionItem', this.edit_question_item)

			for (let i = 0; i < this.filtered_answer_items.length; i++) {
				let obj = this.filtered_answer_items[i]
				await this.$store.dispatch('editAnswerItem', obj)
			}
			await this.$store.dispatch('initQuestions')
			await this.$store.dispatch('initExpandQuestions')
			await this.$store.dispatch('initAnswers')
		},
		async handleDelete(e, id, parent_id) {
			e.preventDefault();

			// const chance = this.calculateChancesOnDelete(parent_id);
			// await this.familyChancesEditing(parent_id, chance);
			await this.$store.dispatch("removeQuestionItem", id);
			await this.$store.dispatch("initQuestions");
			await this.$store.dispatch("initExpandQuestions");
			await this.$router.go();
		},
		async handle_submit_standard_answer(e) {
			e.preventDefault();
			this.new_standard_answer_item.answ_question_id = this.selected_question_id

			await this.$store.dispatch('addAnswerItem', this.new_standard_answer_item)
			await this.$store.dispatch('initAnswers')

			this.new_standard_answer_item.answ_text = ""
			this.new_standard_answer_item.is_correct = false
		},
		async handle_delete_answer(e, answer_id) {
			e.preventDefault()

			await this.$store.dispatch('removeAnswerItem', answer_id)
			await this.$store.dispatch('initAnswers')
		},
		async handle_submit_comparison_answer(e) {
			e.preventDefault()
			this.new_comparison_answer_item.answ_question_id = this.selected_question_id

			await this.$store.dispatch('addAnswerItem', this.new_comparison_answer_item)
			await this.$store.dispatch('initAnswers')

			this.new_comparison_answer_item.answ_text = ""
			this.new_comparison_answer_item.answ_comparison_text = ""
		},
		async handle_submit_new_question(e) {
			e.preventDefault()
			if (!this.question_item.q_title) {
				return
			}

			let response = await this.$store.dispatch('addQuestionItem', this.question_item)
			await this.$store.dispatch('initQuestions')
			await this.$store.dispatch('initExpandQuestions')
			// alert(JSON.stringify(response))
			if (this.question_item.q_type === Question_Types.Open_answer) {
				let q_id = response.data.q_id
				let answer_item = {
					answ_id: 0,
					answ_text: "Текст вопроса",
					answ_question_id: q_id,
					is_correct: true,
				}
				await this.$store.dispatch('addAnswerItem', answer_item)
			}

			this.$bvModal.hide('question-modal')
		},
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
			return this.$store.state.expandQuestions.find(item => item.q_test_id === parseInt(this.$route.params.id) && item.q_parent_id === 0)
		},
		question_types_list() {
			return this.$store.state.question_types
		},
		answersList() {
			return this.$store.state.answers
		},
		filtered_answer_items(){
			return this.$store.state.answers.filter(item => item.answ_question_id === this.selected_question_id)
		},
		multiRootChoice() {
			if (this.clicked) {
				return this.multiRoot2
			}
			return this.multiRoot1
		}
	}
}
</script>

<style scoped>
@import "/static/css/style.css";
.style-input::placeholder {
	color: gray;
}
.standard-answ-correct-switch {
	padding-bottom: 5%;
	margin-left: 2%;
	margin-right: 2%;
}
.style-input {
	background: #ecf0f3;
	padding: 10px;
	padding-left: 20px;
	height: 50px;
	font-size: 14px;
	border-radius: 50px;
	box-shadow: inset 6px 6px 6px #cbced1, inset -6px -6px 6px white;
}
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
