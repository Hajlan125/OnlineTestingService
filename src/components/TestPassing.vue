<template>
	<div>
	<v-app-bar
			color="#42A5F5"
			flat
			height="120px"
			tile
		>
			<!--			<v-toolbar-title class="title1"> Система Онлайн Тестирования</v-toolbar-title>-->
			<h1 class="title1">Система Онлайн Тестирования</h1>

			<v-spacer></v-spacer>

			<h1 class="user-title">{{$store.state.currentTest.test_name}}</h1>

	</v-app-bar>
	<v-app-bar
			color="#E6EEFF"
			flat
			height="50px"
			tile>
		<b-alert show variant="danger" dismissible style="margin-left: auto;margin-right: auto">
			При перезагрузке или закрытии окна, все текущие результаты будут сохранены
		</b-alert>
	</v-app-bar>
	<b-skeleton-wrapper :loading="loading">
		<template #loading>
			<b-card><b-skeleton width="100%"></b-skeleton> </b-card>
		</template>
		<div style="margin-left: auto;margin-right: auto;width: 600px;text-align:center;">
			<div class="quiz-box" id="quiz">
				<div v-for="question in treeList" class="quiz-header">
					<!--				<h4 id="question">{{question.q_title}}</h4>-->
					<b-form-group v-if="question.q_type === Question_Types.Standard" :label="question.q_title">
						<b-form-checkbox-group v-model="user_answers_obj[question.q_id]">
							<b-form-checkbox v-for="a in question.answers" :key="a.answ_id" :value="a.answ_id" name="some-check">{{a.answ_text}}</b-form-checkbox>
						</b-form-checkbox-group>
					</b-form-group>
					<b-form-group v-if="question.q_type === Question_Types.Open_answer" :label="question.q_title">
						<input class="open-answer-input" v-model="user_answers_obj[question.q_id]" />
					</b-form-group>
					<b-form-group v-if="question.q_type === Question_Types.Comparison" :label="question.q_title">
						<b-table thead-tr-class="d-none"
										 :items="current_shuffle(question.answers)" :fields="comparison_question_fields">
							<template #cell(answ_comparison_text)="row">
								<b-form-select :options="get_comparison_options(question.answers)"
															 v-model="user_answers_obj[question.q_id][row.item.answ_text]"
															 value-field="answ_comparison_text" text-field="answ_comparison_text"></b-form-select>
							</template>
						</b-table>
					</b-form-group>
				</div>

			</div>

		</div>

		<b-button class="button" @click="showMsgBoxOne($event)"> <!-- @click="submit($event)" -->
			Закончить
		</b-button>
	</b-skeleton-wrapper>


	<div>
		<b-modal
			data-backdrop="static"
			id="modal-prevent-closing"
			ref="modal"
			no-fade
			:header-bg-variant="headerBgVariant"
			:header-text-variant="headerTextVariant"
			@hide.prevent="showMsgBoxTwo"
			title="Введите текст вопроса"
		>
			<template #modal-header="{  }">
				<b>Ваши результаты</b>
			</template>
			<template #default>
				<p><span class="font-italic">{{currentUser.user_name}}</span>, результаты вашего тестирования</p>
				<b-row>
					<p>Процент правильных ответов: </p><p :class="textClass">{{percentage}}%</p>
				</b-row>

			</template>
			<template #modal-footer="{ cancel, hide }">
				<!-- Кнопка с пользовательским значением триггера закрытия -->
				<b-button size="sm" variant="outline-danger" @click="hide('forget')">
					Выход
				</b-button>
			</template>
		</b-modal>
	</div>
	</div>
</template>

<script>
import {authenticationService} from "../authentication.service";
import {Question_Types, Test_Types, shuffle} from "../utils";
import axios from "axios";

export default {
	created() {
		window.addEventListener('beforeunload', (event) => {
			this.submit(event)
			event.preventDefault();
			event.returnValue = '';
		});
		this.$store.dispatch('initCurrentTest', parseInt(this.$route.params.id))
		const is_tree = this.$store.state.currentTest.test_type;
		this.isTree = is_tree === Test_Types.Tree_test;
		if (is_tree) {
			this.$store.dispatch('initExpandQuestions')
			this.$store.dispatch('initPassingQuestions')
			this.question_list = this.$store.state.expandQuestions.find(item =>
				item.q_test_id === parseInt(this.$route.params.id))
		} else {
			this.$store.dispatch('initPassingQuestions')
			this.question_list = this.$store.state.questions.filter(item =>
				item.q_test_id === parseInt(this.$route.params.id))
		}
		this.ts_start_time = new Date(Date.now()).toISOString();

		this.$_loadingTimeInterval = null
	},
	mounted() {
		this.startLoading()
	},
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
	name: "TestPassing",
	data() {
		return {
			loading: false,
			loadingTime: 0,
			maxLoadingTime: 1,

			Question_Types,
			isTree: false,
			question_list: [],
			selected: [],
			select: null,
			questionsWithMultipleAnswers: [],
			rightAnswers: [],
			currentUser: authenticationService.currentUserValue,
			boxTwo: null,
			headerBgVariant: 'dark',
			headerTextVariant: 'success',
			textClass: 'dark',

			ts_user_id: authenticationService.currentUserValue.user_id,
			ts_test_id: this.$route.params.id,
			ts_start_time: null,
			ts_end_time: null,
			ts_count_right_answers: null,
			ts_score_id: null,
			right_count: 0,
			percentage: 0,
			mark: 0,

			comparison_question_fields: ['answ_text', 'answ_comparison_text'],
			user_answers: {}
		}
	},
	methods: {
		clearLoadingTimeInterval() {
			clearInterval(this.$_loadingTimeInterval)
			this.$_loadingTimeInterval = null
		},
		startLoading() {
			this.loading = true
			this.loadingTime = 0
		},
		current_shuffle(array) {
			return shuffle(array)
		},
		hideHandler() {
			this.$router.push({name: 'home'})
		},
		async showMsgBoxOne(e) {
			this.$bvModal.msgBoxConfirm('Вы уверены, что хотите закончить тест и получить результаты?', {
				title: 'Пожалуйста, подтвердите',
				noFade: true,
				size: 'sm',
				buttonSize: 'sm',
				okVariant: 'success',
				okTitle: 'YES',
				cancelTitle: 'NO',
				cancelVariant: 'danger',
				footerClass: 'p-2',
				hideHeaderClose: false,
				centered: true
			})
				.then(async value => {
					if (value) {
						await this.submit(e)
						this.$bvModal.show('modal-prevent-closing')
					}
				})
				.catch(err => {
					// An error occurred
			})
		},
		showMsgBoxTwo() {
			this.boxTwo = ''
			this.$bvModal.msgBoxConfirm('Пожалуйста, подтвердите, что вы хотите выйти.', {
				title: 'Пожалуйста, подтвердите',
				noFade: true,
				size: 'sm',
				buttonSize: 'sm',
				okVariant: 'danger',
				okTitle: 'YES',
				cancelTitle: 'NO',
				footerClass: 'p-2',
				hideHeaderClose: false,
				centered: true
			})
				.then(value => {
					if (value) {
						this.$router.push({name: 'home'})
					}
				})
				.catch(err => {
					// An error occurred
				})
		},
		getDepth(array) {
			return 1 + Math.max(0, ...array.map(({ children = [] }) => this.getDepth(children)));
		},
		manyAnswersChecking(id, arr) {
			let count = 0;
			let index, len
			for (index = 0, len = arr.length; index < len; ++index) {
				if (arr[index].is_correct) {
					count++
				}
				if (count >= 2) {
					break
				}
			}
			if (count < 2) {
				if (!this.questionsWithMultipleAnswers.includes(id)) {
					this.questionsWithMultipleAnswers.push(id)
				}
			}
			return count >= 2;
		},
		alerts(msg){
			// alert(msg)
			alert(JSON.stringify(this.user_answers_obj))
		},
		addRadioValue() {
			for (let question_id of this.questionsWithMultipleAnswers) {
				const items = this.$store.state.questions.find(item => item.q_id === question_id).answers
				for (let answer of items) {
					if (document.getElementById(answer.answ_id).checked) {
						this.selected.push(answer.answ_id)
					}
				}
			}

		},
		formArrayOfRightAnswers() {
			this.addRadioValue()
			let count = 0;
			const arr = this.treeList;
			for (let q of arr) {
				for (let a of q.answers) {
					if (a.is_correct) {
						this.rightAnswers.push(a.answ_id)
						count++
					}
				}
			}
		},
		async getMark() {
			Number.prototype.inRange = function (a, b) { return this >= a && this <= b; };

			this.headerBgVariant = 'success'
			this.headerTextVariant = 'dark'
			this.textClass = 'text-success'

			this.loading = true
			let percentage = await this.answers_validation()
			this.loading = false

			if (isNaN(percentage)) {
				this.percentage = 0
			} else {
				this.percentage = parseInt(percentage)
			}

			// switch (true) {
			// 	case percentage.inRange(50, 71):
			// 		this.headerBgVariant = 'warning'
			// 		this.headerTextVariant = 'dark'
			// 		this.textClass = 'text-warning'
			// 	case percentage.inRange(71, 81):
			//
			// 	case percentage.inRange(81, 100):
			// 		this.headerBgVariant = 'success'
			// 		this.headerTextVariant = 'dark'
			// 		this.textClass = 'text-success'
			// 	default:
			// 		this.headerBgVariant = 'danger'
			// 		this.headerTextVariant = 'dark'
			// 		this.textClass = 'text-danger'
			// }
			// return this.percentage
		},
		async submit(e) {
			e.preventDefault()

			await this.getMark()

			const item = {
				ts_user_id: this.ts_user_id,
				ts_test_id: this.$route.params.id,
				ts_start_time: this.ts_start_time,
				ts_end_time: new Date(Date.now()).toISOString(),
				ts_score_percent: this.percentage,

			}
			console.log('submitted')
			await this.$store.dispatch('addTestingSystemItem', item);

			// await this.$store.dispatch('initTestingSystem')
			// await this.$router.push({name: "home"});
		},

		get_comparison_options(answers) {
			let options = []

			for (let i = 0; i < answers.length; i++) {
				options.push({answ_comparison_text: answers[i].answ_comparison_text})
			}
			return this.current_shuffle(options)
		},

		async answers_validation() {
			const response = await axios.post('http://localhost:8000/validation', this.user_answers_obj)
			return response.data.percent_score
		}
	},
	computed: {
		questionsList() {
			return this.$store.state.questions.filter(item => item.q_test_id === parseInt(this.$route.params.id))
		},
		treeList() {
			const questions = this.$store.state.questions;
			if (this.isTree) {
				const q_list = new Set();
				const parentQuestion = questions.find(item =>
					item.q_test_id === parseInt(this.$route.params.id) && item.q_parent_id === 0);
				q_list.add(parentQuestion);
				let child_list = questions.filter(item => item.q_parent_id === parentQuestion.q_id);
				while (child_list.length !== 0) {
					const rand = Math.floor(Math.random() * child_list.length);
					q_list.add(child_list[rand]);
					child_list = questions.filter(item => item.q_parent_id === child_list[rand].q_id);
				}
				return Array.from(q_list);
			} else {
				const result = questions
					.filter(item => item.q_test_id === parseInt(this.$route.params.id))
					.reduce((acc, obj) => {
						if (obj.q_parallel_block_id === null) {
							acc.push(obj);
						} else {
							const group = acc.find((g) => g.q_parallel_block_id === obj.q_parallel_block_id);
							if (group) {
								group.objects.push(obj);
							} else {
								acc.push({ q_parallel_block_id: obj.q_parallel_block_id, objects: [obj] });
							}
						}
						return acc;
					}, []);

				const output = result.map(group => {
					if (group.objects) {
						const randomIndex = Math.floor(Math.random() * group.objects.length);
						return group.objects[randomIndex];
					} else {
						return group;
					}
				});
				if (this.$store.state.tests.find(item => item.test_id === parseInt(this.$route.params.id)).test_random_sort) {
					return shuffle(output.flat())
				} else {
					return output.flat().sort((a,b) => a.q_id - b.q_id);
				}
			}
		},

		user_answers_obj() {
			let user_answers = {}
			let tree_list = this.treeList
			for (let i = 0; i < tree_list.length; i++) {
				let item = tree_list[i]
				switch (item.q_type) {
					case Question_Types.Standard:
						user_answers[item.q_id] = []
						break
					case Question_Types.Open_answer	:
						user_answers[item.q_id] = ""
						break
					case Question_Types.Comparison:
						let comparison_items = {}
						for (let j = 0; j < item.answers.length; j++){
							comparison_items[item.answers[j].answ_text] = ""
						}
						user_answers[item.q_id] = comparison_items
						break
				}
			}
			return user_answers
		}
	}
}
</script>

<style scoped>
.open-answer-input{
	-webkit-border-radius: 20px;
	-moz-border-radius: 20px;
	border-radius: 20px;
	border: 1px solid #2d9fd9;
	color: black;
	width: 100%;
	height: 30px;
	padding-left: 10px;
}

.open-answer-input:focus {
	outline: none;
	border: 1px solid #a0d18c;
	color: black;
}
#vo {
	color:green;
}
#nvo {
	color:red;
}
#ot {
	color:blue;
}

.quiz-box{
	background-color: #4f8fff;
	border-radius: 10px;
	box-shadow: 0 0 10px 2px rgba(100, 100, 100, 0.1);
	width: 100%;
	overflow: auto;
}
.quiz-header{
	padding: 32px;
	border-radius: 10px;
	box-shadow: 0 0 10px 2px rgba(100, 100, 100, 0.1);
	background-color: #fff;
}
.button{
	background-color: #5ec6eb;
	border: none;
	display: block;
	width: 50%;
	margin-left: 25%;
	margin-right: 25%;
	cursor: pointer;
	font-size: 20px;
	font-weight: bold;
	text-transform: uppercase;
	color: #000000;

	padding: 15px;
	transition: all 0.5s ease;
}
.button:hover{
	background-color: #438faa;
}
.button:focus{
	outline: none;
	background-color: #5ec6eb;
}
.title1 {
	margin: 1em 0 0.5em 0;
	font-weight: 100;
	text-transform: uppercase;
	color: #d3e7c1;
	font-style: italic;
	font-family: 'Josefin Sans', sans-serif;
	font-size: 58px;
	line-height: 54px;
	text-shadow: 2px 5px 0 rgba(0,0,0,0.2);
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


</style>
