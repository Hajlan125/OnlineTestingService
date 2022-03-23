<template>
	<div>
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
					<v-toolbar-title class="user-title">{{user.user_name}}</v-toolbar-title>
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
		<div>
			<b-card>
				<b-button class="button-71" v-b-modal.test-modal>Добавить</b-button>
				<b-table :items="testsList" :fields="fields" striped responsive="sm" outlined
								>
					<template #cell(ID)="data">
						{{data.item.test_id}}
					</template>
					<template #cell(Название)="data">
						{{data.item.test_name}}
					</template>
					<template #cell(Дисциплина)="data">
						{{data.item.test_subject}}
					</template>
					<template #cell(ДатаСоздания)="data">
						{{getFormatDate(data.item.test_create_date)}}
					</template>
					<template #cell(Создатель)="data">
						{{getUserName(data.item.test_creator)}}
					</template>
					<template #cell(Древовидность)="data">
						<p class="h3 mb-2"><b-icon v-if="data.item.is_tree" icon="check-square" variant="success"></b-icon>
							<b-icon v-else icon="x-square" variant="danger"></b-icon></p>
					</template>
					<template #cell(edit)="data">
						<b-button @click="redirect(data.item.is_tree, data.item.test_id)" variant="outline-secondary">
							<b-icon icon="pencil-square" variant="warning"></b-icon>
						</b-button>
					</template>
					<template #cell(delete)="data">
						<b-button @click="showMsgBox($event, data.item.test_id)" variant="outline-secondary">
							<b-icon icon="trash" variant="danger"></b-icon>
						</b-button>
					</template>
					<template #cell(results)="data">
						<b-button v-b-modal.results-modal @click="showResultsModal(data.item.test_id)" variant="outline-primary">
							<b-icon icon="search"></b-icon>
							Результаты
						</b-button>
					</template>
				</b-table>
			</b-card>

		</div>
		<div class="results-modal">
			<b-modal
				id="results-modal"
				ref="results-modal"
				no-fade
				size="lg"
				scrollable
				title="Результаты"
			>
				<template #modal-header="{ close }">
					<!-- Эмулировать встроенное модальное действие кнопки закрытия заголовка -->
					<b>Результаты прохождения теста</b>
				</template>
				<template #default>
					<b-card>
					<b-table :items="testingSystemList.filter(item => item.ts_test_id === test_id)"
									 :fields="result_fields" striped responsive="sm" outlined>
						<template #head(ts_user_id)="data">
							<span>Студент</span>
						</template>
						<template #cell(ts_user_id)="data">
							{{getUserName(data.item.ts_user_id)}}
						</template>
						<template #head(ts_end_time)="data">
							<span>Дата</span>
						</template>
						<template #cell(ts_end_time)="data">
							{{getFormatDate(data.item.ts_end_time)}}
						</template>
						<template #head(ts_score_id)="data">
							<span>Оценка</span>
						</template>
						<template #cell(ts_score_id)="data">
							{{$store.state.scores.find(item => item.score_id === data.item.ts_score_id).score_text}} ({{data.item.ts_score_id}})
						</template>
					</b-table>
					</b-card>
				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Закрыть
					</b-button>
				</template>
			</b-modal>
		</div>
		<div class="test-modal" title="Создание теста">
			<b-modal no-fade title="Создание теста" id="test-modal" @ok="handleSubmitTest"
							 @hide="resetModal" ok-variant="success" cancel-title="Отмена">
				<b-form-group label="Название теста" label-for="test-name-input">
					<b-form-input v-model="test_item.test_name" id="test-name-input"></b-form-input>
				</b-form-group>
				<b-form-group label="Дисциплина" label-for="test-subject-input">
					<b-form-input v-model="test_item.test_subject" id="test-subject-input"></b-form-input>
				</b-form-group>
				<b-radio-group label="Древовидность" v-model="test_item.is_tree">
					<b-form-radio :value="true">Да</b-form-radio>
					<b-form-radio :value="false">Нет</b-form-radio>
				</b-radio-group>
			</b-modal>

		</div>
	</div>
</template>

<script>
import TestService from "../Services/TestService";
import { authenticationService} from "../authentication.service";
import {mapState, mapActions} from "vuex";
import {wait, redirecting, formatDate} from "../utils";

export default {
	name: "Companies",
	data() {
		return{
			test_id: 0,
			user: "",
			currentUser: authenticationService.currentUserValue,
			fields: ['ID', 'Название', 'Дисциплина', 'ДатаСоздания', 'Создатель', 'Древовидность', 'edit', 'delete', 'results'],
			result_fields: ['ts_user_id', 'ts_end_time', 'ts_score_id'],
			test_item: {
				test_name: "",
				test_subject: "",
				test_creator: authenticationService.currentUserValue.user_id,
				is_tree: false
			}
		}
	},
	created() {
		this.$store.dispatch("initUsers")
		this.$store.dispatch('initTest')
		this.$store.dispatch('initTestingSystem')
	},
	mounted() {
		this.$store.dispatch("initUsers")
		this.$store.dispatch('initTest')
		this.$store.dispatch('initTestingSystem')
		this.$store.dispatch('initScore')
		// this.$store.dispatch('initExpandQuestions')

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
		getFormatDate(date) {
			return new Date(date).toLocaleDateString('ru-RU');
		},

		async showMsgBox(e, id) {
			this.$bvModal.msgBoxConfirm('Вы уверены, что хотите удалить тест?', {
				title: 'Пожалуйста, подтвердите',
				noFade: true,
				size: 'sm',
				buttonSize: 'sm',
				okVariant: 'danger',
				okTitle: 'YES',
				cancelTitle: 'NO',
				cancelVariant: 'secondary',
				footerClass: 'p-2',
				hideHeaderClose: false,
				centered: true
			})
				.then(value => {
					if (value) {
						this.handleRemoveClick(e, id)
					}
				})
				.catch(err => {
					// An error occurred
				})
		},
		redirect(is_tree, id) {
			if (is_tree) {
				this.$router.push({path: `/tree_test/${id}`})
			} else {
				this.$router.push({path: `/test/${id}`})
			}
		},
		async handleRemoveClick(e, id) {
			await this.$store.dispatch("removeTestItem", id);
			// await this.$store.dispatch("initTest");
			// await this.$router.go();
		},
		getUserName(id) {
			return this.$store.state.users.find(item => item.user_id === id).user_name;
		},
		logout() {
			authenticationService.logout();
			this.$router.push("/login");
		},
		showResultsModal(id) {
			this.test_id = id;
			// this.$bvModal.show('results-modal')
		},
		resetModal() {
			this.test_item = {
				test_name: "",
				test_subject: "",
				is_tree: false
			}
		},
		async handleSubmitTest() {
			await this.$store.dispatch('addTestItem', this.test_item)
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
		testingSystemList() {
			return this.$store.state.testingSystems.sort((a,b) => a.ts_end_time - b.ts_end_time)
		}
	},

}
</script>

<style scoped>
.button-71 {
	background-color: #0078d0;
	border: 0;
	border-radius: 56px;
	color: #fff;
	cursor: pointer;
	display: inline-block;
	font-family: system-ui,-apple-system,system-ui,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",sans-serif;
	font-size: 18px;
	font-weight: 600;
	outline: 0;
	padding: 16px 21px;
	position: relative;
	text-align: center;
	text-decoration: none;
	transition: all .3s;
	user-select: none;
	-webkit-user-select: none;
	touch-action: manipulation;
}
.button-71:before {
	background-color: initial;
	background-image: linear-gradient(#fff 0, rgba(255, 255, 255, 0) 100%);
	border-radius: 125px;
	content: "";
	height: 50%;
	left: 4%;
	opacity: .5;
	position: absolute;
	top: 0;
	transition: all .3s;
	width: 92%;
}
.button-71:hover {
	box-shadow: rgba(255, 255, 255, .2) 0 3px 15px inset, rgba(0, 0, 0, .1) 0 3px 5px, rgba(0, 0, 0, .1) 0 10px 13px;
	transform: scale(1.05);
}
@media (min-width: 768px) {
	.button-71 {
		padding: 16px 48px;
	}
}
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
iframe {
	border: none !important;
}
.table100 .ps__rail-y {
	width: 9px;
	background-color: transparent;
	opacity: 1 !important;
	right: 5px;
}
.table100 .ps__rail-y::before {
	content: "";
	display: block;
	position: absolute;
	background-color: #ebebeb;
	border-radius: 5px;
	width: 100%;
	height: calc(100% - 30px);
	left: 0;
	top: 15px;
}
.table100 .ps__rail-y .ps__thumb-y {
	width: 100%;
	right: 0;
	background-color: transparent;
	opacity: 1 !important;
}
.table100 .ps__rail-y .ps__thumb-y::before {
	content: "";
	display: block;
	position: absolute;
	background-color: #cccccc;
	border-radius: 5px;
	width: 100%;
	height: calc(100% - 30px);
	left: 0;
	top: 15px;
}
table {
	width: 100%;
}
th, td {
	font-weight: unset;
	padding-right: 10px;
}

.table100-head th {
	padding-top: 18px;
	padding-bottom: 18px;
}

.table100-body td {
	padding-top: 16px;
	padding-left: 15px;
	padding-bottom: 16px;
}

.table100.ver1 th {
	font-family: Lato-Bold;
	font-size: 18px;
	color: #fff;
	line-height: 1.4;

	background-color: #6c7ae0;
}

.table100.ver1 td {
	font-family: Lato-Regular;
	font-size: 15px;
	color: #808080;
	line-height: 1.4;
}

.table100.ver1 .table100-body tr:nth-child(even) {
	background-color: #f8f6ff;
}
.table100.ver1 .ps__rail-y {
	right: 5px;
}

.table100.ver1 .ps__rail-y::before {
	background-color: #ebebeb;
}

.table100.ver1 .ps__rail-y .ps__thumb-y::before {
	background-color: #cccccc;
}

</style>
