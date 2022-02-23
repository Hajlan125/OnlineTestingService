<template>
	<div class = "container">
		<button v-on:click="$router.push({name:'tests_list'})">Назад</button>
		<h1 class="text-center">Тест {{parseInt(this.$route.params.id)}}</h1>
		<h2 class = "text-center">Список вопросов</h2>
		<form @submit="handleSubmit">
			<div class="form-group">
				<label for="inputTitle">Вопрос</label>
				<input type="text" class="form-control" id="inputTitle" v-model="q_title">
			</div>
			<button type="submit" class="btn btn-success">Добавить</button>
		</form>
<!--		<button v-on:click="handleSubmit()" class="show-modal-button">Добавить</button>-->
		<table class = "table table-striped">
			<thead>
			<tr>
				<th>QuestionsID</th>
				<th>Question Text</th>
				<th>Answers</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="question in questionsList" v-bind:key="question.q_id">
				<td>{{question.q_id }}</td>
				<td>
					<form @submit="editQuestion($event,question.q_id, question.q_title)">
						<input type="text" class="form-control" id="question_edit" v-model="question.q_title">
						<button>Изменить</button>
					</form>

				</td>
				<td>
					<tr v-for="answ in getAnswers(question.q_id)" v-bind:key="answ.answ_id">
						<td>
							<input type="text" class="form-control" id="answer_text_edit" v-model="answ.answ_text">
						</td>
						<td>
							<input type="checkbox" class="checkbox" v-model="answ.is_correct">
						</td>
						<td>
							<button @click="editAnswer($event, answ.answ_id, answ.answ_text, answ.is_correct, '')">Изменить</button>
						</td>
						<td>
							<button @click="handleRemoveAnswers($event,answ.answ_id)">X</button>
						</td>
					</tr>
					<tr>
						<td>
							<input type="text" class="form-control" v-model="answ_text">
						</td>
						<td>
							<input type="checkbox" class="checkbox" v-model="is_correct">
						</td>
						<td>
							<button @click="editAnswer($event, 0,'','', question.q_id)">Добавить</button>
						</td>
					</tr>

<!--				<td><button class="show-modal-button" v-on:click="$router.push({path: `/test/${1}/question/${question.q_id}`})">-->
<!--					<span class="glyphicon glyphicon-pencil"></span>-->
<!--				</button>-->
<!--				</td>-->
				<td><button @click="handleRemoveClick($event, question.q_id)" type="button" class="btn btn-sm btn-link">
					<span class="glyphicon glyphicon-remove"></span>
				</button></td>
			</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import TestService from "../Services/TestService";

import {mapState, mapActions} from "vuex";
import {wait, redirecting} from "../utils";


export default {
	mounted() {
		this.$store.dispatch('initQuestions');
		this.$store.dispatch('initAnswers')
		this.$store.dispatch('initExpandQuestions')
	},
	data() {
		return {
			id: parseInt(this.$route.params.id),
			q_title: "",
			q_test_id: parseInt(this.$route.params.id),
			answ_text: "",
			is_correct: false,
		};
	},
	name: "TestPage",

	components: {

	},

	methods: {
		getAnswers(id) {
			return this.$store.state.answers.filter(item => item.answ_question_id === id)
		},
		async handleRemoveClick(e, id) {
			await this.$store.dispatch("removeQuestionItem", id);
			await this.$store.dispatch("initQuestions");
			await this.$router.go();
		},
		async handleRemoveAnswers(e, id) {
			await this.$store.dispatch("removeAnswerItem", id);
			await this.$store.dispatch("initAnswers");
			await this.$router.go();
		},
		async handleSubmit(e) {
			e.preventDefault();
			const item = {
				q_title: this.q_title,
				q_test_id: this.q_test_id
			};
			await this.$store.dispatch('addQuestionItem', item);

			await this.$store.dispatch('initQuestions')
			await this.$router.go();
		},
		async editQuestion(e, id, q_text) {
			e.preventDefault();
			const item = {
				q_id: id,
				q_title: q_text
			};
			await this.$store.dispatch("editQuestionItem", item);
			await this.$store.dispatch("initQuestions", item);
			await this.$router.go();
		},
		async editAnswer(e, id, a_text, a_correct, q_id) {
			e.preventDefault();
			if (id === 0) {
				const item = {
					answ_text: this.answ_text,
					is_correct: this.is_correct,
					answ_question_id: q_id
				};
				await this.$store.dispatch("addAnswerItem", item);
				await this.$store.dispatch("initAnswers", item);
				await this.$router.go();
			} else {
				const item = {
					answ_id: id,
					answ_text: a_text,
					is_correct: a_correct
				};
				await this.$store.dispatch("editAnswerItem", item);
				await this.$store.dispatch("initAnswers", item);
				await this.$router.go();
			}
		},

	},
	computed: {
		questionsList() {
			return this.$store.state.questions.filter(item => item.q_test_id === parseInt(this.$route.params.id));
		},
		expandQuestionsList() {
			return this.$store.state.expandQuestions.filter(item => item.q_test_id === parseInt(this.$route.params.id));
		},
		answersList() {
			return this.$store.state.answers;
		}
	},

}
</script>

<style scoped>

</style>
