<template>
	<div>
		<appbar></appbar>
		<div class="container">
			<div class="container">
				<h1>Тест №{{current_test_id}}</h1>
				<b-card style="width: 100%">
					<div v-if="!name_subject_editing">
						<b-form-group
							label-cols="1" label-cols-lg="2" content-cols-lg="6" label="Название:" label-for="test-name-input">
							<h3 id="test-name-input">{{current_test.test_name}}</h3>
						</b-form-group>
						<b-form-group
							label-cols="1" label-cols-lg="2" content-cols-lg="6" label="Дисциплина:" label-for="test-subject-input">
							<h3 id="test-subject-input">{{current_test.test_subject}}</h3>
						</b-form-group>
						<b-button variant="outline-warning" class="mr-2" @click="show_name_editing">Изменить</b-button>
					</div>
					<div v-else>
						<b-form @submit="submit_new_name($event)">
							<b-form-group
								label-cols="1" label-cols-lg="2" content-cols-lg="5" label="Название:" label-for="test-name-input">
								<b-form-input required v-model="name_editing_item.test_name" class="style-input" id="test-name-input"></b-form-input>
							</b-form-group>
							<b-form-group
								label-cols="1" label-cols-lg="2" content-cols-lg="5" label="Дисциплина:" label-for="test-subject-input">
								<b-form-input required v-model="name_editing_item.test_subject" class="style-input" id="test-subject-input"></b-form-input>
							</b-form-group>
							<b-button variant="outline-success" class="mr-2" type="submit">Сохранить</b-button>
							<b-button variant="outline" class="mr-2" @click="name_subject_editing = false">Отмена</b-button>
						</b-form>
					</div>
				</b-card>
				<button v-if="isNew" class="btn-add" @click="show_new_question_adding_modal(0)">Добавить первый вопрос</button>
			</div>
			<b-button-toolbar>
				<b-button-group>
					<b-button @click="zoomOut" variant="outline-secondary" class="glyphicon glyphicon-minus"></b-button>
					<b-button disabled variant="outline-secondary">ZOOM</b-button>
					<b-button @click="zoomIn" variant="outline-secondary" class="glyphicon glyphicon-plus"></b-button>
				</b-button-group>
			</b-button-toolbar>
			<div @wheel="zoom">
				<vue-tree
					ref="tree"
					style="width: 1000px; height: 600px; border: 1px solid gray;"
					:collapse-enabled="false"
					:dataset="data_set"
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
								<b-button v-b-popover.hover.bottom="'Добавить ветку'"
													@click="show_new_question_adding_modal(node.q_id)"
													class="glyphicon glyphicon-plus-sign"></b-button>
								<b-button v-b-popover.hover.bottom="'Редактировать вопрос'"
													@click="show_question_edit_modal(node.q_id)"
													class="glyphicon glyphicon-pencil"></b-button>
								<b-button v-b-popover.hover.bottom="'Удалить вопрос'"
													@click="show_q_delete_msg_box($event, node.q_id)"
													class="glyphicon glyphicon-trash" ></b-button>
							</b-button-group>
						</div>
					</template>
				</vue-tree>
			</div>
		</div>

		<div class="new-question-modal">
			<b-modal
				id="new-question-modal"
				ref="new-question-modal"
				no-fade
				title="Введите текст вопроса">
				<template #default>
					<b-form @submit="handle_submit_new_question($event)" id="add-q-form">
						<b-form-group label="Текст вопроса"
													label-for="question-text-input">
							<b-form-input required class="style-input" id="question-text-input"
														v-model="new_question_item.q_title"
														placeholder="Введите текст вопроса" >
							</b-form-input>
						</b-form-group>
						<b-form-group label="Тип вопроса" label-for="q-type-selector">
							<b-form-select id="q-type-selector" v-model="new_question_item.q_type"
														 :options="question_types_list" value-field="type_q_id" text-field="type_q"></b-form-select>
						</b-form-group>
					</b-form>
				</template>
				<template #modal-footer="{ cancel }">
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
		<div class="edit-standard-question-modal">
			<b-modal
				id="edit-standard-question-modal" ref="edit-standard-question-modal" no-fade
				title="Редактирование вопроса" size="lg"
			>
				<template #modal-header="{ close }">
					<b>Редактирование вопроса</b>
				</template>
				<template #default>
					<div>
						<b-form-group label="Текст вопроса"
													label-for="question-text-input">
							<b-form-input @blur="handle_submit_questions_name($event)" id="question-text-input"
														v-model="name_edit_question_item.q_title"
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
								<template #table-colgroup="scope">
									<col :key="scope.fields.answ_id" style="width: 8%">
									<col :key="scope.fields.answ_text" style="width: 67%">
									<col :key="scope.fields.is_correct" style="width: 15%">
									<col :key="scope.fields.delete" style="width: 20%">
								</template>
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
		<div class="edit-open-question-modal">
			<b-modal
				id="edit-open-question-modal" ref="edit-open-question-modal" no-fade
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
							<b-form-input @blur="handle_submit_questions_name($event)" id="question-text-input"
														v-model="name_edit_question_item.q_title"
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
					<div>
						<b-form-group label="Текст вопроса"
													label-for="question-text-input">
							<b-form-input @blur="handle_submit_questions_name($event)" id="question-text-input"
														v-model="name_edit_question_item.q_title"
														class="style-input"
														placeholder="Введите текст вопроса" required>
							</b-form-input>
						</b-form-group>
						<h6>Добавление ответа</h6>
						<b-form @submit="handle_submit_answer($event, selected_question_id)">
							<b-input-group>
								<b-input placeholder="Первая часть" class="style-input" required
												 v-model="new_answer_item.answ_text">Первая часть</b-input>
								<b-input placeholder="Вторая часть" class="style-input" required
												 v-model="new_answer_item.answ_comparison_text">Вторая часть</b-input>
								<b-button variant="outline-primary" type="submit">Добавить</b-button>
							</b-input-group>
						</b-form>
						<b-form-group>
							<b-table
								id = "answer-table" fixed
								:items="filtered_answer_items"
								:fields="comparison_answer_fields"
								responsive="sm"
							>
								<template #table-colgroup="scope">
									<col :key="scope.fields.answ_id" style="width: 7%">
									<col :key="scope.fields.answ_text" style="width: 34%">
									<col :key="scope.fields.answ_comparison_text" style="width: 34%">
									<col :key="scope.fields.delete" style="width: 20%">
								</template>
								<template #cell(answ_text)="data">
									<div>
										<b-form-group>
											<b-form-input required class="style-input"
																		@blur="handle_submit_filtered_answer(data.item.answ_id)"
																		v-model="filtered_answer_items.find(item => item.answ_id === data.item.answ_id).answ_text">
											</b-form-input>
										</b-form-group>
									</div>
								</template>
								<template #cell(answ_comparison_text)="data">
									<div>
										<b-form-group>
											<b-form-input required class="style-input"
																		@blur="handle_submit_filtered_answer(data.item.answ_id)"
																		v-model="filtered_answer_items.find(item => item.answ_id === data.item.answ_id).answ_comparison_text">
											</b-form-input>
										</b-form-group>
									</div>
								</template>
								<template #cell(delete)="data">
									<div>
										<b-button variant="outline-danger" @click="show_ans_delete_msg_box($event, data.item.answ_id)">Удалить</b-button>
									</div>
								</template>
							</b-table>
						</b-form-group>
					</div>
				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
					<!--					<b-button size="sm" variant="outline-success" @click="handle_submit_edited_standard_question($event)">-->
					<!--						Сохранить-->
					<!--					</b-button>-->
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Выход
					</b-button>
				</template>
			</b-modal>
		</div>
	</div>

</template>

<script>
import VueTree from "@ssthouse/vue-tree-chart";
import {Question_Types} from "../utils";
export default {
	mounted() {
		this.$store.dispatch('initQuestions')
		this.$store.dispatch('initAnswers')
		this.$store.dispatch('initExpandQuestions')
		this.$store.dispatch('initQuestionTypes')
	},
	components: {
		VueTree,
	},
	name: 'App',
	data() {
		return {
			name_subject_editing: false,
			name_editing_item: {
				test_id: parseInt(this.$route.params.id),
				test_name: "123",
				test_subject: "123,"
			},
			current_test_id: parseInt(this.$route.params.id),
			selected_question_id: 0,
			treeConfig: { nodeWidth: 200, nodeHeight: 80, levelHeight: 200 },
			showModal: false,
			q_id: 0,
			answer_fields: ['answ_id', 'answ_text', 'is_correct', 'delete'],
			comparison_answer_fields: ['answ_id', 'answ_text', 'answ_comparison_text', 'delete'],

			new_question_item: {
				q_id: 0,
				q_title: "",
				q_test_id: parseInt(this.$route.params.id), //parseInt(this.$route.params.id)
				q_parent_id: 0,
				q_type: 1,
				q_parallel_block_id: null
			},
			name_edit_question_item: {
				q_id: 0,
				q_title: "",
			},

			standard_answer_item: {
				answ_id: 0,
				answ_text: "",
				answ_question_id: 0,
				is_correct: false,
			},
			new_answer_item: {
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
				q_type: 1,
			},
		}
	},
	methods: {
		zoom(e) {
			e.preventDefault()

			if (e.deltaY > 0) {
				this.zoomOut()
			} else {
				this.zoomIn()
			}
		},
		zoomIn() {
			this.$refs.tree.zoomIn()
		},
		zoomOut() {
			this.$refs.tree.zoomOut()
		},
		async handle_submit_new_question(e) {
			e.preventDefault()
			if (!this.new_question_item.q_title) {
				return
			}

			let response = await this.$store.dispatch('addQuestionItem', this.new_question_item)
			await this.$store.dispatch('initQuestions')
			await this.$store.dispatch('initExpandQuestions')

			if (this.new_question_item.q_type === Question_Types.Open_answer) {
				let q_id = response.data.q_id
				let answer_item = {
					answ_id: 0,
					answ_text: "Текст вопроса",
					answ_question_id: q_id,
					is_correct: true,
				}
				await this.$store.dispatch('addAnswerItem', answer_item)
			}

			this.$bvModal.hide('new-question-modal')
		},
		show_new_question_adding_modal(parent_id) {
			this.new_question_item.q_parent_id = parent_id
			this.new_question_item.q_title = ""
			this.new_question_item.q_type = 1

			this.$bvModal.show('new-question-modal')
		},

		show_question_edit_modal(question_id){
			this.selected_question_id = question_id

			const selected_q_item = this.full_questions_list.find(item => item.q_id === question_id)

			this.name_edit_question_item.q_id = question_id
			this.name_edit_question_item.q_title = selected_q_item.q_title


			switch (selected_q_item.q_type) {
				case Question_Types.Standard:
					this.$bvModal.show('edit-standard-question-modal')
					break
				case Question_Types.Open_answer:
					this.$bvModal.show('edit-open-question-modal')
					break
				case Question_Types.Comparison:
					this.$bvModal.show('comparison-question-modal')
					break
			}
		},

		async handle_submit_questions_name(e) {
			e.preventDefault()

			const selected_q_item = this.full_questions_list.find(item => item.q_id === this.selected_question_id)

			if (this.name_edit_question_item.q_title === ""){
				this.name_edit_question_item.q_title = selected_q_item.q_title
				return
			}

			await this.$store.dispatch('editQuestionItem', this.name_edit_question_item)
			await this.$store.dispatch('initExpandQuestions')
			await this.$store.dispatch('initQuestions')

		},
		async handle_submit_answer(e, q_id) {
			e.preventDefault()
			this.new_answer_item.answ_question_id = this.selected_question_id
			let selected_q_type = this.full_questions_list.find(item => item.q_id === q_id).q_type

			if (selected_q_type !== Question_Types.Comparison) {
				this.new_answer_item.answ_comparison_text = null
			}
			await this.$store.dispatch('addAnswerItem', this.new_answer_item)
			await this.$store.dispatch('initAnswers')

			this.new_answer_item.answ_text = ""
			this.new_answer_item.is_correct = false
			this.new_answer_item.answ_comparison_text = ""
		},
		async handle_submit_filtered_answer(a_id) {
			// e.preventDefault()
			const item = this.filtered_answer_items.find(item => item.answ_id === a_id)
			if (item.answ_text === "" || item.answ_comparison_text === ""){
				await this.$store.dispatch('initAnswers')
				return
			}
			await this.$store.dispatch('editAnswerItem', item)
			// await this.$store.dispatch('initAnswers')
		},
		async show_ans_delete_msg_box(e, id) {
			this.$bvModal.msgBoxConfirm('Вы уверены, что хотите удалить?', {
				title: 'Пожалуйста, подтвердите',
				noFade: true,
				size: 'sm',
				buttonSize: 'sm',
				okVariant: 'danger',
				okTitle: 'YES',
				cancelTitle: 'NO',
				cancelVariant: 'secondary',
				footerClass: 'p-2',
				hideHeaderClose: false,
				centered: true
			})
				.then(value => {
					if (value) {
						this.handleRemoveAnswers(e, id)
					}
				})
				.catch(err => {
					// An error occurred
				})
		},
		async handleRemoveAnswers(e, id) {
			e.preventDefault()
			await this.$store.dispatch("removeAnswerItem", id);
			await this.$store.dispatch('initAnswers')
		},

		async show_q_delete_msg_box(e, id) {
			this.$bvModal.msgBoxConfirm('Удаление данного вопроса повлечет также и удаление всех его дочерних вопросов', {
				title: 'Вы уверены, что хотите удалить?',
				noFade: true,
				size: 'sm',
				buttonSize: 'sm',
				okVariant: 'danger',
				okTitle: 'YES',
				cancelTitle: 'NO',
				cancelVariant: 'secondary',
				footerClass: 'p-2',
				hideHeaderClose: false,
				centered: true
			})
				.then(value => {
					if (value) {
						this.handleRemoveQuestion(e, id)
					}
				})
				.catch(err => {
					// An error occurred
				})
		},
		async handleRemoveQuestion(e, id) {
			e.preventDefault()
			await this.$store.dispatch("removeQuestionItem", id);
			await this.$store.dispatch('initExpandQuestions')
			await this.$store.dispatch('initQuestions')
		},
		async submit_new_name(e) {
			e.preventDefault()
			await this.$store.dispatch('editTestItem', this.name_editing_item)
			await this.$store.dispatch('initTest')
			this.name_subject_editing = false
		},
		show_name_editing() {
			this.name_editing_item.test_name = this.current_test.test_name;
			this.name_editing_item.test_subject = this.current_test.test_subject
			this.name_subject_editing = true
		},
	},
	computed: {
		data_set() {
			return this.$store.state.expandQuestions.filter(item => item.q_test_id === this.current_test_id && item.q_parent_id === 0)
		},
		questionList() {
			return this.$store.state.expandQuestions.filter(item => item.q_test_id === this.current_test_id)
		},
		full_questions_list() {
			return this.$store.state.questions.filter(item => item.q_test_id === this.current_test_id)
		},
		isNew() {
			return this.$store.state.questions
				.filter(item => item.q_test_id === parseInt(this.$route.params.id)).length === 0;
		},
		dataSet() {
			return this.$store.state.expandQuestions.find(item => item.q_test_id === this.current_test_id && item.q_parent_id === 0)
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
		current_test() {
			return this.$store.state.tests.find(item => item.test_id === parseInt(this.$route.params.id))
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

li {
	list-style-type: none;
	display: inline-flex;
	padding: 5px;
	margin: 5px;
}
</style>
