<template>
	<div class = "container">
		<button v-on:click="$router.push({name:'test_page', params:{id:`${parseInt($route.params.id)}`}})">Назад</button>
		<h1 class = "text-center">{{questionsList.q_title}}</h1>
		<form @submit="submitQuestion">
			<div class="form-group">
				<label for="inputTitle">Текст вопроса</label>
				<input type="text" class="form-control" id="inputQuestion" v-model="q_title">
			</div>
			<button type="submit" class="btn btn-success">Изменить текст вопроса</button>
		</form>
		<h2 class = "text-center">Список Ответов</h2>
		<form @submit="handleSubmit">
			<div class="form-group">
				<label for="inputTitle">Ответ</label>
				<input type="text" class="form-control" id="inputTitle" v-model="answ_text">
			</div>
			<div class="form-group">
				<label for="inputLink">Является правильным?</label>
				<input type="checkbox" class="checkbox" id="inputLink" v-model="is_correct">
			</div>

			<button type="submit" class="btn btn-success">Добавить</button>
		</form>

<!--		<button v-on:click="gotosite(`http://localhost:9000/companies/0`)" class="show-modal-button">Добавить</button>-->
		<table class = "table table-striped">
			<thead>
			<tr>
				<th>AnswerID</th>
				<th>Answer Text</th>
				<th>Is correct?</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="answ in answersList" v-bind:key="answ.answ_id">
				<td>{{answ.answ_id }}</td>
				<td>{{answ.answ_text}}</td>
				<td>{{answ.is_correct}}</td>

				<td><button class="show-modal-button" v-on:click="$router.push({path: `/companies/${company.id}`})">
					<span class="glyphicon glyphicon-pencil"></span>
				</button>
				</td>
				<td><button @click="handleRemoveClick($event, company.id)" type="button" class="btn btn-sm btn-link">
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
		this.$store.dispatch("initQuestions");
		this.$store.dispatch("initAnswers")
	},
	data() {
		return {
			id: parseInt(this.$route.params.id),
			q_title: "",
			answ_text: "",
			answ_question_id: parseInt(this.$route.params.q_id),
			is_correct: false
		};
	},
	created() {
		if (this.id !== 0 ) {
			this.q_title = this.questionsList.q_title;
		}
	},
	name: "Companies",

	components: {

	},

	methods: {
		redirecting(link) {
			redirecting(link, this.$store, this.$router)
		},
		async handleRemoveClick(e, id) {
			await this.$store.dispatch("removeAnswerItem", id);
			await this.$store.dispatch("initAnswers");
			await this.$router.go();
		},
		async handleSubmit(e) {
			e.preventDefault();
			const item = {
				answ_text: this.answ_text,
				answ_question_id: this.answ_question_id,
				is_correct: this.is_correct
			};
			await this.$store.dispatch('addAnswerItem', item);

			await this.$store.dispatch('initAnswers')
			await this.$router.go();
		},
		async submitQuestion(e) {
			e.preventDefault();
			const item = {
				q_id: this.answ_question_id,
				q_title: this.q_title
			};
			await this.$store.dispatch('editQuestionItem', item);
			await this.$store.dispatch('initQuestions')
			await this.$router.go();
		},
		gotosite(producturl){
			window.location.href = producturl
		},

	},
	computed: {
		questionsList() {
			return this.$store.state.questions.find(item => item.q_id === parseInt(this.$route.params.q_id));
		},
		answersList() {
			return this.$store.state.answers.filter(item => item.answ_question_id === parseInt(this.$route.params.q_id))
		}

	},

}
</script>

<style scoped>

</style>
