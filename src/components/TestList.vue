<template>
	<div class = "container">
		<h1>{{user.user_name}}</h1>
		<button @click="logout">Выйти</button>
		<b-button>На главную</b-button>
		<h1 class = "text-center">Список тестов</h1>
		<button v-on:click="$router.push('test_creation')" class="show-modal-button">Добавить</button>
		<table class = "table table-striped">
			<thead>
			<tr>
				<th>TestID</th>
				<th>Test name</th>
				<th>Test Subject</th>
				<th>Creation Date</th>
				<th>Creator</th>
				<th>Is Tree?</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="test in testsList" v-bind:key="test.test_id">
				<td>{{test.test_id }}</td>
				<td>{{test.test_name}}</td>
				<td>{{test.test_subject}}</td>
				<td>{{test.test_create_date}}</td>
				<td>{{getUserName(test.test_creator)}}</td>
				<td>{{test.is_tree}}</td>

				<td><button class="show-modal-button" v-on:click="redirect(test.is_tree, test.test_id)">
					<span class="glyphicon glyphicon-pencil"></span>
				</button>
				</td>
				<td><button @click="handleRemoveClick($event, test.test_id)" type="button" class="btn btn-sm btn-link">
					<span class="glyphicon glyphicon-remove"></span>
				</button></td>
			</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
import TestService from "../Services/TestService";
import { authenticationService} from "../authentication.service";
import {mapState, mapActions} from "vuex";
import {wait, redirecting} from "../utils";


export default {
	name: "Companies",
	data() {
		return{
			user: ""
		}
	},
	mounted() {
		this.$store.dispatch('initTest')
		this.$store.dispatch('initExpandQuestions')
		// if (localStorage.getItem('currentUser')) {
		// 	try {
		// 		this.user = JSON.parse(localStorage.getItem('currentUser'))
		// 	} catch (e) {
		// 		alert(e)
		// 	}
		// }
		this.user = authenticationService.currentUserValue;
	},


	components: {

	},

	methods: {
		redirect(is_tree, id) {
			if (is_tree) {
				this.$router.push({path: `/tree_test/${id}`})
			} else {
				this.$router.push({path: `/test/${id}`})
			}
		},
		async handleRemoveClick(e, id) {
			await this.$store.dispatch("removeTestItem", id);
			await this.$store.dispatch("initTest");
			await this.$router.go();
		},
		getUserName(id) {
			return this.$store.state.users.find(item => item.user_id === id).user_name;
		},
		logout() {
			authenticationService.logout();
			this.$router.push("/login");
		}
	},
	computed: {
		usersList() {
			return this.$store.state.users;
		},
		testsList() {
			if (this.user.user_type === "teacher") {
				return this.$store.state.tests.filter(item => item.test_creator === this.user.user_id);
			}
			else {
				return this.$store.state.tests;
			}
		},
	},

}
</script>

<style scoped>

</style>
