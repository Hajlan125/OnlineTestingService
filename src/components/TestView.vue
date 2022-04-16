<template>
	<div data-app>
		<v-app-bar
			color="#42A5F5"
			flat
			height="150px"
			tile
		>
			<!--			<v-toolbar-title class="title1"> Система Онлайн Тестирования</v-toolbar-title>-->
			<h1 class="title1">Система Онлайн Тестирования</h1>

			<v-spacer></v-spacer>

			<ul style="padding-left: 10px">
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
			class="second-toolbar"
			height="50px"
			tile>
			<b-button @click="$router.push({name: 'home'})" pill>Вернуться в главное меню</b-button>
		</v-app-bar>
		<div class="wrapper-view">
			<div id="mainContent">
				<h3>{{currentTest.test_name}}</h3>
				<h4>Количество вопросов: {{questionsItemsLength}}</h4>
				<h4>{{treeTestText}}</h4>
			</div>
			<div id="secondContent">
				<b-button variant="primary" @click="$router.push({name: 'test_passing', params: { id: ($route.params.id)}})">Начать прохождение теста</b-button>
			</div>
		</div>
	</div>
</template>

<script>
import { authenticationService } from "../authentication.service";


export default {
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
		this.$store.dispatch('initCurrentTest', parseInt(this.$route.params.id))
		this.$store.dispatch('initQuestions')
		this.$store.dispatch('initExpandQuestions')
	},
	data () {
		return {
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
		timeToSolve() {
			if (this.treeTestText === "Древовидный тест") {
				return this.getDepth([this.firstQuestion])
			} else {
				return this.questionsItemsLength
			}
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
		}
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
.user-icon {
	width: 40px !important;
	height: 40px !important;
}
.wrapper-view {
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	width: 100%;
	min-height: 100%;
	padding: 20px;
}

#mainContent {
	-webkit-border-radius: 10px 10px 10px 10px;
	border-radius: 10px 10px 10px 10px;
	background: #fff;
	padding: 30px;
	width: 90%;
	max-width: 600px;
	position: relative;
	padding: 0px;
	-webkit-box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
	box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
	text-align: center;
}
#secondContent {
	-webkit-border-radius: 10px 10px 10px 10px;
	border-radius: 10px 10px 10px 10px;
	background: #fff;
	padding: 30px;
	width: 90%;
	max-width: 275px;
	position: relative;
	padding: 0px;
	-webkit-box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
	box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
	text-align: center;
}


</style>
