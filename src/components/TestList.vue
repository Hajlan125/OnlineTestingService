<template>
	<div>
		<appbar></appbar>
		<div>
			<b-card>
				<button class="btn-add" v-b-modal.test-modal>Создать</button>
				<b-table :items="testsList" :fields="fields" striped responsive="sm" outlined>
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
					<template #cell(ТипТеста)="data">
						{{get_test_type_name(data.item.test_type)}}
					</template>
					<template #cell(learning_material_edit)="data">
						<b-button v-b-modal.learning-material-modal @click="show_learning_material_modal(data.item.test_id)"
											variant="outline-secondary">
							<b-icon icon="pencil-square" variant="warning"></b-icon>Учебный материал
						</b-button>
					</template>
					<template #cell(edit)="data">
						<b-button @click="redirect(data.item.test_type, data.item.test_id)" variant="outline-secondary">
							<b-icon icon="pencil-square" variant="warning"></b-icon>Конструктор
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
					<template #cell(save)="data">
						<b-dropdown right text="Скачать">
							<b-dropdown-item @click="export_test(data.item.test_id, true)">Полный тест</b-dropdown-item>
							<b-dropdown-item @click="export_test(data.item.test_id, false)">Случайный вариант</b-dropdown-item>
						</b-dropdown>
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
						<template #head(ts_score_percent)="data">
							<span>Оценка</span>
						</template>
						<template #head(SpentTime)="data">
							<span>Затрачено времени</span>
						</template>
						<template #cell(SpentTime)="data">
							{{time_spent(data.item.ts_start_time, data.item.ts_end_time)}}
						</template>

					</b-table>
					</b-card>
				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
					<b-button size="sm" @click="export_results(selected_test_id)">
						Скачать результаты
					</b-button>
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Закрыть
					</b-button>

				</template>
			</b-modal>
		</div>
		<div class="test-modal" title="Создание теста">
			<b-modal id="test-modal" cancel-title="Отмена" cancel-variant="secondary"
							 no-fade title="Создание теста" @hide="resetModal">
				<template #default>
					<b-form id="test-form" @submit="handleSubmitTest($event)">
						<b-form-group label="Название теста" label-for="test-name-input">
							<b-form-input class="style-input" required v-model="test_item.test_name" id="test-name-input"></b-form-input>
						</b-form-group>
						<b-form-group label="Дисциплина" label-for="test-subject-input">
							<b-form-input class="style-input" required v-model="test_item.test_subject" id="test-subject-input"></b-form-input>
						</b-form-group>
						<b-form-group label="Тип" label-for="test-type-select">
							<b-form-select required id="test-type-select" v-model="test_item.test_type"
														 :options=test_type_options value-field="type_t_id" text-field="type_test"></b-form-select>
						</b-form-group>
					</b-form>
				</template>
				<template #modal-footer="{ cancel }">
					<b-btn @click="cancel">Отмена</b-btn>
					<b-btn variant="success" type="submit" form="test-form">OK</b-btn>
				</template>
			</b-modal>
		</div>
		<div class="learning-material-modal" title="Учебный материал">
			<b-modal no-fade title="Учебный материал" id="learning-material-modal" @ok="handle_add_learning_material"
							  ok-variant="success" cancel-title="Отмена">
				<b-form-group label="Редактирование учебного материала" label-for="learning-material-input">
					<b-form-textarea rows="20" size="large" v-model="test_learning_material_item.test_learning_material"
													 id="test-l-m-input"></b-form-textarea>
				</b-form-group>
			</b-modal>

		</div>
		<div class="test-export-block" id="test-export-block">
			<vue-html2pdf
				:show-layout="false"
				:float-layout="true"
				:enable-download="false"
				:preview-modal="true"
				:paginate-elements-by-height="1400"
				filename=""
				:pdf-quality="2"
				:manual-pagination="false"
				pdf-format="a4"
				pdf-orientation="landscape"
				pdf-content-width="800px"

				ref="html2Pdf"
			>
				<section slot="pdf-content">
					<div>
						<h2>{{this.get_test_name}}</h2>
						<div v-for="question in get_export_test">
							<b-form-group v-if="question.q_type === 1" :label="question.q_title">
								<b-form-checkbox-group>
									<b-form-checkbox v-for="a in question.answers" :key="a.answ_id" :value="a.answ_id" name="some-check">{{a.answ_text}}</b-form-checkbox>
								</b-form-checkbox-group>
							</b-form-group>
							<b-form-group v-if="question.q_type === 2" :label="question.q_title">
								<b-form-input></b-form-input>
							</b-form-group>
							<b-form inline v-if="question.q_type === 3" :label="question.q_title">
								<label>{{question.q_title}}</label>
								<b-list-group>
									<b-list-group-item v-for="item in get_first_part(question.answers)">{{item}}</b-list-group-item>
								</b-list-group>
								<b-list-group>
									<b-list-group-item v-for="item in get_first_part(question.answers)">{{'       '}}</b-list-group-item>
								</b-list-group>
								<b-list-group>
									<b-list-group-item v-for="item in get_second_part(question.answers)">{{item}}</b-list-group-item>
								</b-list-group>
							</b-form>
						</div>
					</div>
				</section>
			</vue-html2pdf>
		</div>
		<div class="results-export-block">
			<vue-html2pdf
				:show-layout="false"
				:float-layout="true"
				:enable-download="false"
				:preview-modal="true"
				:paginate-elements-by-height="1400"
				filename=""
				:pdf-quality="2"
				:manual-pagination="false"
				pdf-format="a4"
				pdf-orientation="landscape"
				pdf-content-width="800px"

				ref="results_html_2_pdf"
			>
				<section slot="pdf-content">
					<div>
						<b-table :items="testingSystemList.filter(item => item.ts_test_id === test_id)"
										 :fields="non_sortable_result_fields" striped responsive="sm" outlined>
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
							<template #head(ts_score_percent)="data">
								<span>Оценка</span>
							</template>
							<template #head(SpentTime)="data">
								<span>Затрачено времени</span>
							</template>
							<template #cell(SpentTime)="data">
								{{time_spent(data.item.ts_start_time, data.item.ts_end_time)}}
							</template>

						</b-table>
					</div>
				</section>
			</vue-html2pdf>

		</div>
	</div>

</template>

<script>
import { authenticationService} from "../authentication.service";
import {Test_Types, Role, shuffle} from "../utils";
import html2pdf from "html2pdf.js";
import VueHtml2pdf from 'vue-html2pdf';

export default {
	name: "TestList",
	data() {
		return{
			comparison_question_fields: ['answ_text', 'answ_comparison_text'],
			test_id: 0,
			test_type_options: [],
			user: "",
			currentUser: authenticationService.currentUserValue,
			fields: ['ID', 'Название', 'Дисциплина', 'ДатаСоздания', 'Создатель', 'ТипТеста',
				'learning_material_edit', 'edit', 'delete', 'results', 'save'],
			result_fields: [{key: 'ts_user_id', sortable: true}, {key: 'ts_end_time', sortable: true},
				{key: 'ts_score_percent', sortable: true}, {key: 'SpentTime', sortable: false}],
			non_sortable_result_fields: [{key: 'ts_user_id', sortable: false}, {key: 'ts_end_time', sortable: false},
				{key: 'ts_score_percent', sortable: false}, {key: 'SpentTime', sortable: false}],
			test_item: {
				test_name: "",
				test_subject: "",
				test_creator: authenticationService.currentUserValue.user_id,
				test_type: null,
				test_learning_material: "Учебный материал"
			},
			test_learning_material_item: {
				test_id: 0,
				test_learning_material: "Учебный материал"
			},
			selected_test_id: 0,
			is_full_test: false
		}
	},
	created() {
		// this.$store.dispatch("initUsers")
		// this.$store.dispatch('initTest')
		// this.$store.dispatch('initTestingSystem')
	},
	mounted() {
		this.$store.dispatch("initUsers")
		this.$store.dispatch('initTest')
		this.$store.dispatch('initTestingSystem')
		this.$store.dispatch('initTestType')
		this.$store.dispatch('initUserTypes')
		this.$store.dispatch('initExpandQuestions')
		this.$store.dispatch('initPassingQuestions')
		this.test_type_options = [...[{'type_t_id': null, 'type_test': 'Выберите тип'}], ...this.test_types_list]
		// this.$store.dispatch('initScore')
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
		alerts(id) {
			alert(id)
		},
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
		redirect(type, id) {
			if (type === Test_Types.Tree_test) {
				this.$router.push({path: `/tree_test/${id}`})
			} else if (type === Test_Types.Standard) {
				this.$router.push({path: `/test/${id}`})
			}
		},
		async handleRemoveClick(e, id) {
			await this.$store.dispatch("removeTestItem", id);
			await this.$store.dispatch('initTest')
			// await this.$store.dispatch("initTest");
			// await this.$router.go();
		},
		getUserName(id) {
			return this.$store.state.users.find(item => item.user_id === id).user_name;
		},
		get_test_type_name(id) {
			return this.test_types_list.find(item => item.type_t_id === id).type_test;
		},
		logout() {
			authenticationService.logout();
			this.$router.push("/login");
		},
		showResultsModal(id) {
			this.test_id = id;
			// this.$bvModal.show('results-modal')
		},
		show_learning_material_modal(test_id) {
			this.test_learning_material_item = {
				test_id: test_id,
				test_learning_material: this.testsList.find(item => item.test_id === test_id).test_learning_material
			}
		},
		resetModal() {
			this.test_item.test_name = ""
			this.test_item.test_subject = ""
			this.test_item.test_type = null

			// this.test_learning_material_item.test_id = 0
			// this.test_learning_material_item.test_learning_material = "Учебный материал"
		},
		async handleSubmitTest(e) {
			// alert(this.test_item.test_type)
			e.preventDefault()
			await this.$store.dispatch('addTestItem', this.test_item)
			this.$bvModal.hide('test-modal')
			this.resetModal()
		},
		async handle_add_learning_material() {

			await this.$store.dispatch('editTestItem', this.test_learning_material_item)
			await this.$store.dispatch('initTest')
		},
		export_test(test_id, is_full) {
			this.selected_test_id = test_id
			this.is_full_test = is_full
			this.$refs.html2Pdf.generatePdf()
		},
		export_results(test_id) {
			this.selected_test_id = test_id
			this.$refs.results_html_2_pdf.generatePdf()
		},

		get_first_part(answers) {
			let first_part = []
			for (let i = 0; i < answers.length; i++) {
				first_part.push(answers[i].answ_text)
			}
			return shuffle(first_part)
		},
		get_second_part(answers) {
			let second_part = []
			for (let i = 0; i < answers.length; i++) {
				second_part.push(answers[i].answ_comparison_text)
			}
			return shuffle(second_part)
		},
		time_spent(date1, date2) {
			let start = new Date(date1.substring(0, date1.length-1))
			let end = new Date(date2.substring(0, date2.length-1))

			let diff_ms = Math.abs(end.getTime() - start.getTime())
			let diff_minutes = Math.floor(diff_ms / (1000 * 60))
			let diff_seconds = diff_ms % (1000 * 60) / 1000

			return diff_minutes + " минут " + diff_seconds + " секунд"
		}

	},
	computed: {
		usersList() {
			return this.$store.state.users;
		},
		testsList() {  // ДОБАВИТЬ ЗАВИСИМОСТЬ ОТ УРОВНЯ ДОСТУПА
			if (this.user.user_type === 1) {
				return this.$store.state.tests;
			}
			else {
				return this.$store.state.tests.filter(item => item.test_creator === this.user.user_id);
			}
		},
		testingSystemList() {
			return this.$store.state.testingSystems.sort((a,b) => a.ts_end_time - b.ts_end_time)
		},
		test_types_list() {
			return this.$store.state.test_types
		},
		get_export_test() {
			if (this.selected_test_id !== 0) {
				let isTree = this.$store.state.tests.find(item => item.test_id === this.selected_test_id).test_type === Test_Types.Tree_test

				if (this.is_full_test) {
					return this.$store.state.questions.filter(item => item.q_test_id === this.selected_test_id)
				} else {
					if (isTree) {
						let q_list = [];
						let child_list = [];
						q_list.push(this.$store.state.questions.find(item =>
							item.q_test_id === this.selected_test_id && item.q_parent_id === 0 ))
						child_list = this.$store.state.questions.filter(item => item.q_parent_id === q_list[0].q_id)
						while (child_list.length !== 0) {
							let rand = Math.floor(Math.random() * child_list.length);
							q_list.push(child_list[rand])
							child_list = this.$store.state.questions.filter(item => item.q_parent_id === child_list[rand].q_id)
						}
						const final_list = q_list;
						return final_list
					} else {
						let arr = this.$store.state.questions.filter(item => item.q_test_id === this.selected_test_id)
						const result = arr.reduce((acc, obj) => {
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

						const output = result.reduce((acc, group) => {
							if (group.objects) {
								const randomIndex = Math.floor(Math.random() * group.objects.length);
								acc.push(group.objects[randomIndex]);
							} else {
								acc.push(group);
							}
							return acc;
						}, []);
						if (this.$store.state.tests.find(item => item.test_id === this.selected_test_id).test_random_sort) {
							return shuffle(output.flat())
						} else {
							return output.flat().sort((a,b) => a.q_id - b.q_id);
						}
					}
				}
			}
		},

		get_test_name() {
			if (this.selected_test_id !== 0){
				const item = this.$store.state.tests.find(item => item.test_id === this.selected_test_id)
				return item.test_name
			}
		},

	},

}
</script>

<style scoped>
@import "/static/css/style.css";
.style-input::placeholder {
	color: gray;
}

.style-input {
	background: #ecf0f3;
	padding: 10px;
	padding-left: 20px;
	height: 50px;
	font-size: 14px;
	border-radius: 50px;
	box-shadow: inset 6px 6px 6px #cbced1, inset -6px -6px 6px white;
}
.test-export-block {
	/*display: none;*/
}
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

.btn-add {
	--b: 3px;   /* border thickness */
	--s: .15em; /* size of the corner */
	--c: #42A5F5;

	padding: calc(.05em + var(--s)) calc(.3em + var(--s));
	color: var(--c);
	--_p: var(--s);
	background:
		conic-gradient(from 90deg at var(--b) var(--b),#0000 90deg,var(--c) 0)
		var(--_p) var(--_p)/calc(100% - var(--b) - 2*var(--_p)) calc(100% - var(--b) - 2*var(--_p));
	transition: .3s linear, color 0s, background-color 0s;
	outline: var(--b) solid #0000;
	outline-offset: .2em;
}
.btn-add:hover,
.btn-add:focus-visible{
	--_p: 0px;
	outline-color: var(--c);
	outline-offset: .05em;
}
.btn-add:active {
	background: var(--c);
	color: #fff;
}

.btn-add {
	font-family: system-ui, sans-serif;
	font-weight: bold;
	font-size: 2rem;
	cursor: pointer;
	border: none;
	margin: .1em;
}

</style>
