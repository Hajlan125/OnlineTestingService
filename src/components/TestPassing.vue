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
	<div style="margin-left: auto;margin-right: auto;width: 600px;text-align:center;">
		<div class="quiz-box" id="quiz">
			<div v-for="question in treeList" class="quiz-header">
				<h4 id="question">{{question.q_title}}</h4>
				<div v-if="manyAnswersChecking(question.q_id, question.answers)">
					<b-form-group label="Ответы">
						<b-form-checkbox-group v-model="selected">
							<b-form-checkbox v-for="a in question.answers" :key="a.answ_id" :value="a.answ_id" name="some-check">{{a.answ_text}}</b-form-checkbox>
						</b-form-checkbox-group>
					</b-form-group>
				</div>
				<div v-if="!manyAnswersChecking(question.q_id, question.answers)">
					<b-form-group label="Ответы">
						<b-form-radio-group>
							<b-form-radio :id="`${a.answ_id}`" :key="a.answ_id" v-for="a in question.answers" :ref="a.answ_id" :value="a.answ_id" name="radio-btn" >{{a.answ_text}}</b-form-radio>
						</b-form-radio-group>
					</b-form-group>
				</div>
			</div>

		</div>

	</div>

	<b-button class="button" @click="showMsgBoxOne($event)"> <!-- @click="submit($event)" -->
			Закончить
	</b-button>
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
				<!-- Эмулировать встроенное модальное действие кнопки закрытия заголовка -->
				<b>Ваши результаты</b>
			</template>
			<template #default>
				<p><span class="font-italic">{{currentUser.user_name}}</span>, результаты вашего тестирования</p>
				<b-row>
					<p>Количество правильных ответов: </p><p> <span :class="textClass">{{right_count}}</span>/{{rightAnswers.length}}</p>
				</b-row>
				<b-row>
					<p>Процент правильных ответов: </p><p :class="textClass">{{percentage}}%</p>
				</b-row>
				<b-row>
					<p>Итоговая оценка: </p><p :class="textClass">{{mark}}</p>
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

export default {
	created() {
		//предотвращение закрытия окна
		window.addEventListener('beforeunload', (event) => {
			this.submit(event)
			// Cancel the event as stated by the standard.
			event.preventDefault();
			// Chrome requires returnValue to be set.
			event.returnValue = '';

		});

		// alert('При перезагрузке или закрытии окна, все текущие результаты будут сохранены')

		this.$store.dispatch('initCurrentTest', parseInt(this.$route.params.id))
		const is_tree = this.$store.state.currentTest.is_tree;
		this.isTree = is_tree;
		if (is_tree) {
			this.$store.dispatch('initExpandQuestions')
			this.$store.dispatch('initPassingQuestions')
			this.question_list = this.$store.state.expandQuestions.find(item => item.q_test_id === parseInt(this.$route.params.id))
		} else {
			this.$store.dispatch('initPassingQuestions')
			this.question_list = this.$store.state.questions.filter(item => item.q_test_id === parseInt(this.$route.params.id))
		}
		this.ts_start_time = new Date(Date.now()).toISOString();

	},
	mounted() {

	},
	name: "TestPassing",
	data() {
		return {
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
		}
	},
	methods: {
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
				.then(value => {
					if (value) {
						this.submit(e)
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
			alert(msg)
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
		getMark() {
			Number.prototype.inRange = function (a, b) {
				return this >= a && this <= b;
			};
			let right_answers = this.rightAnswers.sort()
			let your_answers = this.selected.sort()

			//получение всех правильных ответов пользователя
			let your_right_answers = right_answers.filter(i => your_answers.includes(i))
			this.right_count = your_right_answers.length

			let percentage = (your_right_answers.length / right_answers.length) * 100

			if (isNaN(percentage)) {
				this.percentage = 0
			} else {
				this.percentage = parseInt(percentage)
			}

			switch (true) {
				case percentage.inRange(50, 71):
					this.headerBgVariant = 'warning'
					this.headerTextVariant = 'dark'
					this.textClass = 'text-warning'
					return 3
				case percentage.inRange(71, 81):
					this.headerBgVariant = 'success'
					this.headerTextVariant = 'dark'
					this.textClass = 'text-success'
					return 4
				case percentage.inRange(81, 100):
					this.headerBgVariant = 'success'
					this.headerTextVariant = 'dark'
					this.textClass = 'text-success'
					return 5
				default:
					this.headerBgVariant = 'danger'
					this.headerTextVariant = 'dark'
					this.textClass = 'text-danger'
					return 2
			}
		},
		async submit(e) {
			this.formArrayOfRightAnswers()

			e.preventDefault()
			let mark = this.getMark();
			this.mark = mark;

			const item = {
				ts_user_id: this.ts_user_id,
				ts_test_id: this.$route.params.id,
				ts_start_time: this.ts_start_time,
				ts_end_time: new Date(Date.now()).toISOString(),
				ts_score_id: mark,
				ts_count_right_answers: this.right_count,


			}
			console.log('submitted')
			await this.$store.dispatch('addTestingSystemItem', item);

			// await this.$store.dispatch('initTestingSystem')
			// await this.$router.push({name: "home"});
		}
	},
	computed: {
		questionsList() {
			return this.$store.state.questions.filter(item => item.q_test_id === parseInt(this.$route.params.id))
		},
		treeList() {
			if (this.isTree) {
				let q_list = [];
				let child_list = [];
				q_list.push(this.$store.state.questions.find(item => item.q_test_id === parseInt(this.$route.params.id) && item.q_parent_id === 0 ))
				child_list = this.$store.state.questions.filter(item => item.q_parent_id === q_list[0].q_id)
				while (child_list.length !== 0) {
					let rand = Math.floor(Math.random() * child_list.length);
					q_list.push(child_list[rand])
					child_list = this.$store.state.questions.filter(item => item.q_parent_id === child_list[rand].q_id)
				}
				const final_list = q_list;
				return final_list
			} else {
				return this.$store.state.questions.filter(item => item.q_test_id === parseInt(this.$route.params.id))
			}
		},
	}
}
</script>

<style scoped>

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


</style>
