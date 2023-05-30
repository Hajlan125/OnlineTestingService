<template>
	<div data-app>
		<appbar></appbar>
<!--		<div class="card">-->
<!--			<h2 class="card__title">{{currentTest.test_name}}</h2>-->
<!--			<h3 class="card__subtitle">{{ currentTest.test_subject }}</h3>-->
<!--			<p class="card__description"><span v-html="text_to_hyperlink(currentTest.test_learning_material)"></span></p>-->
<!--			<ul class="card__list">-->
<!--				<li class="card__item">Тип теста: {{ test_types_list.find(item => item.type_t_id === currentTest.test_type).type_test }}</li>-->
<!--				<li class="card__item">Кол-во вопросов: {{this.$store.state.expandQuestions.filter(item => item.q_test_id === currentTest.test_id).length }}</li>-->
<!--			</ul>-->
<!--			<b-button variant="outline-primary">Пройти тест</b-button>-->
<!--		</div>-->
		<b-skeleton-wrapper class="skeleton-wrapper" :loading="loading">
			<template #loading>
				<b-card>
					<b-skeleton width="85%"></b-skeleton>
					<b-skeleton width="55%"></b-skeleton>
					<b-skeleton width="70%"></b-skeleton>
				</b-card>
			</template>
			<div class="courses-container">
				<div class="course">
					<div class="course-preview">
						<h6 class="test-name-text">Тест</h6>
						<h2>{{currentTest.test_name}}</h2>
						<a>{{ currentTest.test_subject }}</a>
					</div>
					<div class="course-info">
						<div class="progress-container">

							<span class="progress-text">Кол-во вопросов: {{this.$store.state.expandQuestions.filter(item => item.q_test_id === currentTest.test_id).length}}</span>
						</div>
						<span class="progress-text">{{ test_types_list.find(item => item.type_t_id === currentTest.test_type).type_test }}</span>
						<h4 class="learning-material-text" v-html="text_to_hyperlink(currentTest.test_learning_material)"></h4>
						<button class="btn" @click="$router.push({name: 'test_passing', params: { id: ($route.params.id)}})">Пройти тест</button>
					</div>
				</div>
			</div>
		</b-skeleton-wrapper>
	</div>
</template>

<script>
import { authenticationService } from "../authentication.service";
import {wait} from "../utils";

export default {
	watch: {
		loading(newValue, oldValue) {
			if (newValue !== oldValue) {
				this.clearLoadingTimeInterval()

				if (newValue) {
					this.$_loadingTimeInterval = setInterval(() => {
						this.loadingTime++
					}, 250)
				}
			}
		},
		loadingTime(newValue, oldValue) {
			if (newValue !== oldValue) {
				if (newValue === this.maxLoadingTime) {
					this.loading = false
				}
			}
		}
	},
	created() {
		if (localStorage.getItem('currentUser')) {
			try {
				this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
			} catch (e) {
				alert(e)
			}
		} else {
			this.currentUser = {
				user_type: 'noname'
			}
		}
		this.$_loadingTimeInterval = null
		this.$store.dispatch('initCurrentTest', parseInt(this.$route.params.id))
		this.$store.dispatch('initQuestions')
		this.$store.dispatch('initExpandQuestions')
	},
	mounted() {
		this.$store.dispatch('initTestType')
		this.startLoading()
	},
	data () {
		return {
			loading: false,
			loadingTime: 0,
			maxLoadingTime: 1,
			currentUser: null,
			userFromApi: "",
			user: "",
			search_test_id: null,
			treeTestText: "",

		};
	},
	methods: {
		alerts() {
			alert("assad")
		},
		logout() {
			authenticationService.logout();
			this.$router.push("/login");
		},
		getDepth(array) {
			return 1 + Math.max(0, ...array.map(({ children = [] }) => this.getDepth(children)));
		},
		clearLoadingTimeInterval() {
			clearInterval(this.$_loadingTimeInterval)
			this.$_loadingTimeInterval = null
		},
		startLoading() {
			this.loading = true
			this.loadingTime = 0
		},
		text_to_hyperlink(mess) {
			let reg =  /(\w+:\/\/)?(www\.)?[\w+\-]+\.\w+/g;
			mess = mess.replace(reg, function(s){
				let str = (/:\/\//.exec(s) === null ? "http://" + s : s );
				return "<a href=\""+ str + "\">" + str /*s*/ + "</a>";
			});
			return mess
		}
	},
	computed: {
		currentTest() {
			const test = this.$store.state.currentTest;
			if (test.is_tree) {
				this.treeTestText = "Древовидный тест"
			} else {
				this.treeTestText = "Стандартный тест"
			}
			return test
		},
		questionsItemsLength() {
			return this.$store.state.questions.filter(item => item.q_test_id === parseInt(this.$route.params.id)).length
		},
		firstQuestion() {
			return this.$store.state.expandQuestions.find(item => item.q_test_id === parseInt(this.$route.params.id))
		},
		test_types_list() {
			return this.$store.state.test_types
		},
	}
};
</script>

<style scoped>
ul, li {
	list-style-type: none;
	display: inline-flex;
	padding: 5px;
	margin: 5px;
}
/*.card {*/
/*	max-width: 500px;*/
/*	margin: 0 auto;*/
/*	padding: 20px;*/
/*	border: 1px solid #ccc;*/
/*	border-radius: 5px;*/
/*	text-align: center;*/
/*}*/

/*.card__title {*/
/*	font-size: 28px;*/
/*	margin-bottom: 10px;*/
/*}*/

/*.card__subtitle {*/
/*	font-size: 18px;*/
/*	margin-bottom: 10px;*/
/*}*/

/*.card__description {*/
/*	font-size: 16px;*/
/*	margin-bottom: 20px;*/
/*}*/

/*.card__list {*/
/*	list-style: none;*/
/*	padding: 0;*/
/*	margin: 0;*/
/*}*/

/*.card__item {*/
/*	font-size: 14px;*/
/*	margin-bottom: 5px;*/
/*}*/
.course {
	background-color: #fff;
	border-radius: 10px;
	box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
	display: flex;
	max-width: 100%;
	margin-top: 1%;
	margin-left: 30%;
	overflow: hidden;
	width: 700px;

}

.course h6 {
	opacity: 0.6;
	margin: 0;
	color: white;
	letter-spacing: 1px;
	text-transform: uppercase;
}

.course h2 {
	letter-spacing: 1px;
	margin: 10px 0;
	color: white;
}
.course h3 {
	letter-spacing: 1px;
	margin: 10px 0;
	color: black;
}
.course a {
	color: whitesmoke;
}

.course-preview {
	background-color: #42A5F5; /* #2A265F */
	color: #fff;
	padding: 30px;
	max-width: 350px;
}

.course-preview a {
	color: #fff;
	display: inline-block;
	font-size: 12px;
	opacity: 0.6;
	margin-top: 30px;
	text-decoration: none;
}

.course-info {
	padding: 30px;
	position: relative;
	width: 100%;
}

.progress-container {
	position: absolute;
	top: 30px;
	right: 30px;
	text-align: right;
	width: 150px;

}

.progress-text {
	font-size: 10px;
	opacity: 0.6;
	letter-spacing: 1px;
}

.btn {
	background-color: #42A5F5;
	border: 0;
	border-radius: 50px;
	box-shadow: 0 10px 10px rgba(0, 0, 0, 0.2);
	color: #fff;
	font-size: 16px;
	padding: 12px 25px;
	position: absolute;
	bottom: 1%;
	right: 30px;
	letter-spacing: 1px;
}

.skeleton-wrapper {
	margin-top: 1%;
	margin-left: 30%;
	width: 700px;
}
</style>
