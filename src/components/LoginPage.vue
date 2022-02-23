<template>
	<div>

		<h2>Login</h2>
		<form @submit.prevent="onSubmit">
			<div class="form-group">
				<label for="username">Username</label>
				<input type="text" v-model.trim="username" name="username" class="form-control"  />
			</div>
			<div class="form-group">
				<label htmlFor="password">Password</label>
				<input type="password" v-model.trim="password" name="password" class="form-control" />
			</div>
			<div class="form-group">
				<button class="btn btn-primary">
					<span class="spinner-border spinner-border-sm" v-show="loading"></span>
					<span>Login</span>
				</button>
			</div>
			<div v-if="error" class="alert alert-danger">{{error}}</div>
		</form>
	</div>
</template>

<script>

import { authenticationService } from '../authentication.service';

export default {
	mounted() {
		this.$store.dispatch('initUsers')
	},
	data () {
		return {
			username: '',
			password: '',
			submitted: true,
			loading: false,
			error: ''
		};
	},

	created () {
		// redirect to home if already logged in
		if (authenticationService.currentUserValue) {
			return this.$router.push('/home');
		}

		// get return url from route parameters or default to '/'

	},
	methods: {
		onSubmit () {
			this.submitted = true;

			// stop here if form is invalid

			this.loading = true;
			const someUser = this.$store.state.users.find(item => item.login === this.username && item.password === this.password)
			if (someUser) {
				authenticationService.login(someUser, this.username, this.password)
				this.$router.push("/home")
			} else {
				alert("неправильный логин или пароль")
			}
		}
	}
};
</script>
