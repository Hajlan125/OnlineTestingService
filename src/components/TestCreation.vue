<template>
	<div class="panel panel-primary">
		<button @click="$router.push('tests')">Назад</button>
		<div class="panel-heading">Создание теста</div>
		<div class="panel-body">
			<form @submit="handleSubmit">
				<div class="form-group">
					<label for="inputTitle">Название</label>
					<input type="text" class="form-control" id="inputTitle" v-model="test_name">
				</div>
				<div class="form-group">
					<label for="inputPath">Дисциплина</label>
					<input type="text" class="form-control" id="inputPath" v-model="test_subject">
				</div>
				<div class="form-group">
					<label for="inputBool">Является древовидным?</label>
					<input type="checkbox" class="checkbox" id="inputBool" v-model="is_tree">
				</div>
				<div>
					<label></label>
				</div>
				<button type="submit" class="btn btn-success">Сохранить</button>
			</form>
		</div>
	</div>
</template>

<script>
import {authenticationService} from "../authentication.service";

export default {
	name: "TestCreation",
	mounted() {
		this.user = authenticationService.currentUserValue;
	},
	data() {
		return {
			user: "",
			test_creator: authenticationService.currentUserValue.user_id,
			test_name: "",
			test_create_date: "",
			test_subject: "",
			is_tree: false
		}
	},
	methods: {
		async handleSubmit(e) {
			e.preventDefault();
			const item = {
				test_creator: this.test_creator,
				test_name: this.test_name,
				test_subject: this.test_subject,
				is_tree: this.is_tree
			};
			await this.$store.dispatch('addTestItem', item);

			await this.$store.dispatch('initTest')
			await this.$router.push({name: "tests_list"});
		},

	},

}
</script>

<style scoped>

</style>
