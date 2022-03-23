<template>
	<div>
		<v-app-bar color="#42A5F5" flat height="150px" tile width="100%">
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
			width="100%"
			height="50px"
			tile>
			<b-button @click="redirect()" pill>Назад</b-button>
		</v-app-bar>

		<b-card style="width: 90%; margin-right: auto; margin-left: auto">
			<form @submit="submitQuestion">
				<div class="form-group">
					<label for="inputQuestion">Текст вопроса</label>
					<input v-model="q_title" type="text" class="form-control" id="inputQuestion">
				</div>
				<button type="submit" class="btn btn-success">Изменить текст вопроса</button>
			</form>
		</b-card>

		<h2 class = "text-center">Список Ответов</h2>
		<b-card style="width: 90%; margin-right: auto; margin-left: auto">
			<b-table
				id = "answer-table" fixed
				:items="answersList"
				:fields="answer_fields"
				responsive="sm"
			>
				<template #cell(edit) = "answ_edit">
					<b-button variant="outline-warning" @click="showAnswerModalWindow(answ_edit.item.answ_id)">
						<b-icon icon="pencil-square"></b-icon>
						Изменить
					</b-button>
				</template>
				<template #cell(delete) = "answ_delete">
					<b-button variant="outline-danger" @click="showMsgBoxOne($event, answ_delete.item.answ_id)">
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
			<b-button variant="primary" @click="showAnswerModalWindow(0)">
				<b-icon icon="plus"></b-icon>
				Добавить
			</b-button>
		</b-card>
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
					<b-button size="sm" variant="outline-success" @click="handleSubmit($event)">
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
		this.$store.dispatch("initQuestions");
		this.$store.dispatch("initAnswers")
		this.currentUser = authenticationService.currentUserValue
		this.q_title = this.question.q_title
	},
	mounted() {
		this.$store.dispatch("initQuestions");
		this.$store.dispatch("initAnswers")
		this.currentUser = authenticationService.currentUserValue
		this.q_title = this.question.q_title
	},
	data() {
		return {
			answer_fields: ['answ_id', "answ_text", "is_correct", 'edit', 'delete'],
			answer_item: {
				answ_id: 0,
				answ_text: "",
				answ_question_id: parseInt(this.$route.params.q_id),
				is_correct: false,
			},
			is_new: true,
			id: parseInt(this.$route.params.id),
			q_title: "",
			answ_text: "",
			answ_question_id: parseInt(this.$route.params.q_id),
			is_correct: false,
			currentUser: "",
		};
	},
	name: "QuestionPage",

	components: {

	},

	methods: {
		logout() {
			authenticationService.logout()
			this.$router.push({name:'login'})
		},
		redirect() {
			const is_tree = this.$store.state.tests.find(item => item.test_id === parseInt(this.$route.params.id)).is_tree
			if (is_tree) {
				this.$router.push({path: `/tree_test/${parseInt(this.$route.params.id)}`})
			} else {
				this.$router.push({path: `/test/${parseInt(this.$route.params.id)}`})
			}
		},
		async handleRemoveClick(e, id) {
			await this.$store.dispatch("removeAnswerItem", id);
			// await this.$store.dispatch("initAnswers");
			// await this.$router.go();
		},
		async handleSubmit(e) {
			e.preventDefault();
			if(this.is_new) {
				await this.$store.dispatch('addAnswerItem', this.answer_item);
				this.$bvModal.hide('answer-modal')
			} else {
				await this.$store.dispatch('editAnswerItem', this.answer_item)
			}

			// await this.$store.dispatch('initAnswers')
			// await this.$router.go();
		},
		async submitQuestion(e) {
			e.preventDefault();
			const item = {
				q_id: this.answ_question_id,
				q_title: this.q_title
			};
			this.$bvToast.toast('Данные успешно сохранены',{
				toaster: 'b-toaster-top-center',
				variant: 'success',
				title: "Успешно"
			})
			await this.$store.dispatch('editQuestionItem', item);
			// await this.$store.dispatch('initQuestions')
			// await this.$router.go();
		},
		showToast() {
			this.$bvToast.toast('Данные успешно сохранены',{
				toaster: 'b-toaster-top-center',
				variant: 'success',
				title: "Успешно"
			})
		},
		showAnswerModalWindow(answ_id) {
			if (answ_id === 0) {
				this.answer_item.answ_id = 0
				this.answer_item.answ_text = ""
				this.answer_item.is_correct = false
				this.is_new = true
			} else {
				const item = this.answersList.find(item => item.answ_id === answ_id)
				this.answer_item.answ_id = answ_id
				this.answer_item.answ_text = item.answ_text
				this.answer_item.is_correct = item.is_correct
				this.is_new = false
			}
			this.$bvModal.show('answer-modal')
		},
		async showMsgBoxOne(e, id) {
			this.$bvModal.msgBoxConfirm('Вы уверены, что хотите удалить ответ?', {
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
						this.handleRemoveClick(e, id)
					}
				})
				.catch(err => {
					// An error occurred
				})
		},
	},
	computed: {
		question() {
			return this.$store.state.questions.find(item => item.q_id === parseInt(this.$route.params.q_id));
		},
		answersList() {
			return this.$store.state.answers.filter(item => item.answ_question_id === parseInt(this.$route.params.q_id)).sort((a,b) => a.answ_id - b.answ_id)
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
