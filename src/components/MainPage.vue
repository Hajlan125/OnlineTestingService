<template>
	<div>
		<h1>Home</h1>
		<h3 v-if="user.user_type === ('teacher') || user.user_type === ('admin')">YOU ARE TEACHER</h3>
		<button @click="logout">LOGOUT</button>
		<button v-if="user.create_test_permission" @click="$router.push('tests')">Тесты</button>
		<p>You're logged in with Vue.js & JWT!!</p>
		<p>Your role is: <strong>{{user.user_type}}</strong>.</p>
		<p>This page can be accessed by all authenticated users.</p>
		<div>
			Current user from secure api end point:
			<ul v-if="user">
				<li>{{user.user_name}}</li>
			</ul>
		</div>
	</div>
</template>

<script>
import { authenticationService } from "../authentication.service";


export default {
	mounted() {
		if (localStorage.getItem('currentUser')) {
			try {
				this.user = JSON.parse(localStorage.getItem('currentUser'))
			} catch (e) {
				alert(e)
			}
		}
	},
	data () {
		return {
			currentUser: authenticationService.currentUserValue,
			userFromApi: "",
			user: ""
		};
	},
	methods: {
		logout() {
			authenticationService.logout();
			this.$router.push("/login");
		},
	}
};
</script>
