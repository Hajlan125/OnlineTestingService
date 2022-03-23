<template>
	<div>
		<v-app-bar
			color="#42A5F5"
			flat
			height="150px"
			tile
		>
			<!--			<v-toolbar-title class="title1"> Система Онлайн Тестирования</v-toolbar-title>-->
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
		<v-app-bar
			color="#E6EEFF"
			flat
			height="50px"
			tile>
			<b-button @click="$router.push({name: 'tests_list'})" pill>Вернуться к списку</b-button>
			<b-button pill @click="$router.push({name: 'home'})">Вернуться на главную страницу</b-button>
		</v-app-bar>
		<h1 class="text-center">Тест {{parseInt(this.$route.params.id)}}</h1>
		<h2 class = "text-center">Список вопросов</h2>
		<b-table :items="questionsList"
						 :fields="fields" striped responsive="sm" outlined fixed
						 style="margin-left: auto; margin-right: auto; width: 90%">
			<template #cell(Ответы)="row">
				<b-button size="sm" @click="row.toggleDetails" variant="outline-primary" class="mr-2">
					{{ row.detailsShowing ? 'Скрыть' : 'Показать'}}
				</b-button>
			</template>
			<template #thead-top="data">
				<b-tr>
					<b-th colspan="5">
						<b-button variant="primary" @click="showQuestionModalWindow(0)">Добавить новый вопрос</b-button>
					</b-th>
				</b-tr>
			</template>
			<template #row-details="row">
				<b-card>
					<b-table
						id = "answer-table" fixed
						:items="answersList.filter(item => item.answ_question_id === row.item.q_id)"
						:fields="answer_fields"
						responsive="sm"
					>
						<template #cell(edit) = "answ_edit">
							<b-button variant="outline-warning" @click="showAnswerModalWindow(answ_edit.item.answ_id, row.item.q_id)">
								<b-icon icon="pencil-square"></b-icon>
								Изменить
							</b-button>
						</template>
						<template #cell(delete) = "answ_delete">
							<b-button variant="outline-danger" @click="showMsgBoxOne($event, answ_delete.item.answ_id, 'ответ')">
								<b-icon icon="trash"></b-icon>
								Удалить
							</b-button>
						</template>
						<template #head(answ_id)="data">
							№
						</template>
						<template #head(answ_text)="data">
							Текст ответа
						</template>
						<template #head(is_correct)="data">
							Правильный
						</template>
						<template #cell(is_correct)="data">
							<p class="h3 mb-2"><b-icon v-if="data.item.is_correct" icon="check-square" variant="success"></b-icon>
							<b-icon v-else icon="x-square" variant="danger"></b-icon></p>
						</template>
						<template #head(edit)="data">
							<h1></h1>
						</template>
						<template #head(delete)="data">
							<h1></h1>
						</template>
						<template #cell(answ_id)="data">
							{{data.index + 1}}
						</template>
					</b-table>
					<b-button variant="primary" @click="showAnswerModalWindow(0, row.item.q_id)">
						<b-icon icon="plus"></b-icon>
						Добавить
					</b-button>
				</b-card>
			</template>
			<template #cell(edit)="row">
				<b-button variant="outline-warning" class="mr-2" @click="showQuestionModalWindow(row.item.q_id)">
					<b-icon icon="pencil-square"></b-icon>
					Изменить
				</b-button>
			</template>
			<template #cell(delete)="row">
				<b-button variant="outline-danger" class="mr-2" @click="showMsgBoxOne($event, row.item.q_id, 'вопрос')">
					<b-icon icon="trash"></b-icon>
					Удалить
				</b-button>
			</template>
			<template #head(q_id)="row">
				№
			</template>
			<template #cell(q_id)="row">
				{{row.index + 1}}
			</template>
			<template #head(q_title)="row">
				Текст вопроса
			</template>
			<template #head(edit)="row">
				<h1></h1>
			</template>
			<template #head(delete)="row">
				<h1></h1>
			</template>

		</b-table>

		<div class="answ-modal">
			<b-modal
				id="answer-modal"
				ref="answer-modal"
				no-fade
				title="Редактирование ответа"
			>
				<template #modal-header="{ close }">
					<!-- Эмулировать встроенное модальное действие кнопки закрытия заголовка -->
					<b>Редактирование ответа</b>
				</template>
				<template #default>
					<b-form>
						<b-form-group label="Текст ответа"
													label-for="answer-text-input">
							<b-form-input id="answer-text-input" v-model="answer_item.answ_text"
														placeholder="Введите текст ответа" required>

							</b-form-input>
						</b-form-group>
						<b-form-group label="Является правильным?"
													label-for="answer-correct-input">
							<b-form-radio-group id="answer-correct-input" v-model="answer_item.is_correct">
								<b-form-radio :value="true">Да</b-form-radio>
								<b-form-radio :value="false">Нет</b-form-radio>
							</b-form-radio-group>
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
					<b-form>
						<b-form-group label="Текст вопроса"
													label-for="question-text-input">
							<b-form-input id="question-text-input" v-model="question_item.q_title"
														placeholder="Введите текст вопроса" required>
							</b-form-input>
						</b-form-group>
					</b-form>
				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
					<b-button size="sm" variant="outline-success" @click="handleSubmitQuestion($event)">
						Сохранить
					</b-button>
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Выход
					</b-button>
				</template>
			</b-modal>
		</div>
	</div>
</template>

<script>
import TestService from "../Services/TestService";

import {mapState, mapActions} from "vuex";
import {wait, redirecting} from "../utils";
import {authenticationService} from "../authentication.service";


export default {
	created() {
		this.$store.dispatch('initPassingQuestions');
		this.$store.dispatch('initAnswers');
	},
	data() {
		return {
			id: parseInt(this.$route.params.id),
			fields: ['q_id', 'q_title', "Ответы", 'edit', 'delete'],
			answer_fields: ['answ_id', 'answ_text', 'is_correct', 'edit', 'delete'],

			q_title: "",
			q_test_id: parseInt(this.$route.params.id),

			answ_text: "",
			answ_question_id: 0,
			is_correct: false,

			is_new: true,
			is_q_new: true,

			answer_item: {
				answ_id: 0,
				answ_text: "",
				answ_question_id: 0,
				is_correct: false,
			},
			question_item: {
				q_id: 0,
				q_title: "",
				q_test_id: parseInt(this.$route.params.id),
				q_chance: 100
			},

			currentUser: JSON.parse(localStorage.getItem('currentUser')),
			selected: []
		};
	},
	name: "TestPage",

	components: {

	},

	methods: {
		showToast() {
			this.$bvToast.toast('Данные успешно сохранены',{
				toaster: 'b-toaster-top-center',
				variant: 'success',
				title: "Успешно"
			})
		},
		showAnswerModalWindow(answ_id, q_id) {
			if (answ_id === 0) {
				this.answer_item.answ_id = 0
				this.answer_item.answ_text = ""
				this.answer_item.answ_question_id = q_id
				this.answer_item.is_correct = false
				this.is_new = true
			} else {
				const item = this.answersList.find(item => item.answ_id === answ_id)
				this.answer_item.answ_id = answ_id
				this.answer_item.answ_text = item.answ_text
				this.answer_item.answ_question_id = item.answ_question_id
				this.answer_item.is_correct = item.is_correct
				this.is_new = false
			}
			this.$bvModal.show('answer-modal')
		},
		showQuestionModalWindow(q_id) {
			if (q_id === 0) {
				this.question_item.q_id = 0
				this.question_item.q_title = ""
				this.is_q_new = true
			} else {
				const item = this.$store.state.questions.find(item => item.q_id === q_id)
				this.question_item.q_id = item.q_id
				this.question_item.q_title = item.q_title
				this.is_q_new = false
			}
			this.$bvModal.show('question-modal')
		},
		logout() {
			authenticationService.logout();
			this.$router.push("/login");
		},
		async showMsgBoxOne(e, id, type) {
			this.$bvModal.msgBoxConfirm('Вы уверены, что хотите удалить '+ type +'?', {
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
						switch (type) {
							case 'вопрос':
								this.handleRemoveQuestion(e, id)
								break
							case 'ответ':
								this.handleRemoveAnswers(e, id)
								break
						}
					}
				})
				.catch(err => {
					// An error occurred
				})
		},

		async handleRemoveQuestion(e, id) {
			await this.$store.dispatch("removeQuestionItem", id);
		},
		async handleRemoveAnswers(e, id) {
			await this.$store.dispatch("removeAnswerItem", id);
		},

		async handleSubmitQuestion(e) {
			e.preventDefault();
			if (this.is_q_new) {
				await this.$store.dispatch('addQuestionItem', this.question_item)
				this.$bvModal.hide('question-modal')
			} else {
				await this.$store.dispatch('editQuestionItem', this.question_item)
				this.showToast()
			}
		},
		async handleSubmitAnswer(e) {
			e.preventDefault()
			if (this.is_new) {
				await this.$store.dispatch('addAnswerItem', this.answer_item)
				this.$bvModal.hide('answer-modal')
			} else {
				await this.$store.dispatch('editAnswerItem', this.answer_item)
				this.showToast()
			}
		}

	},
	computed: {
		questionsList() {
			return this.$store.state.questions.filter(item => item.q_test_id === parseInt(this.$route.params.id)).sort((a, b) => a.q_id - b.q_id);
		},
		answersList() {
			return this.$store.state.answers.sort((a, b) => a.answ_id - b.answ_id);
		}
	},

}
</script>

<style scoped>
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
