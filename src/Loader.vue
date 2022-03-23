<template>
	<div className="loader"></div>
</template>

<script>
import {mapActions} from "vuex";
import {wait} from './utils';
import {authenticationService} from "./authentication.service";

export default {
	mounted() {
		this.$nextTick(async () => {
			await this.$store.dispatch('initUsers');
			await this.$store.dispatch('initTest');
			await this.$store.dispatch('initPassingQuestions');
			await this.$store.dispatch('initExpandQuestions');
			await this.$store.dispatch('initTestingSystem');
			await this.$store.dispatch('initAnswers');
			await this.$store.dispatch('initScore')
			// await wait(300);
			await this.$router.push({name: "login"});
		});
	},
	methods: {
		...mapActions([])
	}

}
</script>

<style scoped lang="scss">

</style>
