<template>
	<div>
		<appbar></appbar>
		<h1 class="text-center">Тест №{{parseInt(this.$route.params.id)}}</h1>

		<b-card style="margin-left: auto; margin-right: auto; width: 90%">
			<div v-if="!name_subject_editing">
				<b-form-group
					label-cols="1" label-cols-lg="1" content-cols-lg="5" label="Название:" label-for="test-name-input">
					<h3 id="test-name-input">{{current_test.test_name}}</h3>
				</b-form-group>
				<b-form-group
					label-cols="1" label-cols-lg="1" content-cols-lg="5" label="Дисциплина:" label-for="test-subject-input">
					<h3 id="test-subject-input">{{current_test.test_subject}}</h3>
				</b-form-group>
				<b-button variant="outline-warning" class="mr-2" @click="show_name_editing">Изменить</b-button>
			</div>
			<div v-else>
				<b-form @submit="submit_new_name($event)">
					<b-form-group
						label-cols="1" label-cols-lg="1" content-cols-lg="5" label="Название:" label-for="test-name-input">
						<b-form-input required v-model="name_editing_item.test_name" class="style-input" id="test-name-input"></b-form-input>
					</b-form-group>
					<b-form-group
						label-cols="1" label-cols-lg="1" content-cols-lg="5" label="Дисциплина:" label-for="test-subject-input">
						<b-form-input required v-model="name_editing_item.test_subject" class="style-input" id="test-subject-input"></b-form-input>
					</b-form-group>
					<b-button variant="outline-success" class="mr-2" type="submit">Сохранить</b-button>
					<b-button variant="outline" class="mr-2" @click="name_subject_editing = false">Отмена</b-button>
				</b-form>
			</div>
		</b-card>
		<h2 class = "text-center">Список вопросов</h2>
		<b-table :items="questionsList.filter(item => item.q_parallel_block_id === null)"
						 :fields="fields" striped responsive="sm" outlined fixed
						 style="margin-left: auto; margin-right: auto; width: 90%">
			<template #thead-top="data">
				<b-tr>
					<b-th colspan="4">
						<button class="btn-add" @click="showQuestionModalWindow(0)">Добавить новый вопрос</button>
						<button class="btn-add" @click="show_parallel_block_modal_window(0)">Добавить блок параллельных вопросов</button>
					</b-th>
					<b-th colspan="2">
						<label>Случайный порядок вопросов при прохождении</label>
						<div class="input_wrapper">
							<input v-model="random_sort" @click="submit_new_sort"
										 type="checkbox" class="switch_4">
							<svg class="is_checked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 426.67 426.67">
								<path d="M153.504 366.84c-8.657 0-17.323-3.303-23.927-9.912L9.914 237.265c-13.218-13.218-13.218-34.645 0-47.863 13.218-13.218 34.645-13.218 47.863 0l95.727 95.727 215.39-215.387c13.218-13.214 34.65-13.218 47.86 0 13.22 13.218 13.22 34.65 0 47.863L177.435 356.928c-6.61 6.605-15.27 9.91-23.932 9.91z"/>
							</svg>
							<svg class="is_unchecked" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212.982 212.982">
								<path d="M131.804 106.49l75.936-75.935c6.99-6.99 6.99-18.323 0-25.312-6.99-6.99-18.322-6.99-25.312 0L106.49 81.18 30.555 5.242c-6.99-6.99-18.322-6.99-25.312 0-6.99 6.99-6.99 18.323 0 25.312L81.18 106.49 5.24 182.427c-6.99 6.99-6.99 18.323 0 25.312 6.99 6.99 18.322 6.99 25.312 0L106.49 131.8l75.938 75.937c6.99 6.99 18.322 6.99 25.312 0 6.99-6.99 6.99-18.323 0-25.313l-75.936-75.936z" fill-rule="evenodd" clip-rule="evenodd"/>
							</svg>
						</div>
					</b-th>
				</b-tr>
			</template>
			<template #cell(edit)="row">
				<b-button variant="outline-warning" class="mr-2" @click="show_question_modal(row.item.q_id, row.item.q_type)">
					<b-icon icon="pencil-square"></b-icon>
					Изменить
				</b-button>
<!--				<button class="btn-edit" @click="show_question_modal(row.item.q_id, row.item.q_type)"><b-icon icon="pencil-square"></b-icon>-->
<!--					Изменить</button>-->
			</template>
			<template #cell(q_type)="row">
				<p>{{question_types_list.find(item => item.type_q_id === row.item.q_type).type_q}}</p>
			</template>
			<template #cell(delete)="row">
				<b-button variant="outline-danger" class="mr-2" @click="showMsgBoxOne($event, row.item.q_id, 'вопрос')">
					<b-icon icon="trash"></b-icon>
					Удалить
				</b-button>
<!--				<button class="btn-delete" @click="showMsgBoxOne($event, row.item.q_id, 'вопрос')"><b-icon icon="trash"></b-icon>-->
<!--					Удалить</button>-->
			</template>
			<template #cell(answ_count)="row">
				<span v-if="row.item.q_type !== Question_Types.Open_answer">
					{{answersList.filter(item => item.answ_question_id === row.item.q_id).length}}</span>
				<span v-else>Открытый ответ</span>
			</template>
			<template #head(answ_count)="row">
				<span>Кол-во ответов</span>
			</template>

		</b-table>

		<b-table :items="parallel_blocks_list" :fields="p_b_fields" striped responsive="sm" outlined fixed
						 style="margin-left: auto; margin-right: auto; width: 90%">
			<template #thead-top="data">
				<b-tr>
					<b-th colspan="5"><h1>Параллельные вопросы
						<b-icon icon="info-square-fill"
										style="width: 0.7em; height: 0.7em; margin-bottom: 0.1em"
										v-b-popover.hover="'Один случайно выбранный вопрос из данного блока будет предложен пользователю для ответа во время тестирования'"></b-icon></h1>
						</b-th>
				</b-tr>
			</template>
			<template #cell(questions)="row">
				<b-button size="sm" @click="row.toggleDetails" variant="outline-primary" class="mr-2">
					{{ row.detailsShowing ? 'Скрыть' : 'Показать'}}
				</b-button>
			</template>
			<template #row-details="row">
				<b-card>
					<b-table :items="questionsList.filter(item => item.q_parallel_block_id === row.item.p_b_id)"
									 :fields="fields" striped responsive="sm" outlined fixed
									 style="margin-left: auto; margin-right: auto; width: 90%">
						<template #thead-top="data">
							<b-tr>
								<b-th colspan="6">
									<button class="btn-add" @click="showQuestionModalWindow(0, row.item.p_b_id)">Добавить новый вопрос</button>
								</b-th>
							</b-tr>
						</template>
						<template #cell(edit)="row">
													<b-button variant="outline-warning" class="mr-2" @click="show_question_modal(row.item.q_id, row.item.q_type)">
														<b-icon icon="pencil-square"></b-icon>
														Изменить
													</b-button>
<!--							<button class="btn-edit"><b-icon icon="pencil-square"></b-icon>-->
<!--								Изменить</button>-->
						</template>
						<template #cell(q_type)="row">
							<p>{{question_types_list.find(item => item.type_q_id === row.item.q_type).type_q}}</p>
						</template>
						<template #cell(delete)="row">
													<b-button variant="outline-danger" class="mr-2" @click="showMsgBoxOne($event, row.item.q_id, 'вопрос')">
														<b-icon icon="trash"></b-icon>
														Удалить
													</b-button>
<!--							<button class="btn-delete" @click="showMsgBoxOne($event, row.item.q_id, 'вопрос')">-->
<!--								<b-icon icon="trash"></b-icon>Удалить</button>-->
						</template>
						<template #cell(answ_count)="row">
				<span v-if="row.item.q_type !== Question_Types.Open_answer">
					{{answersList.filter(item => item.answ_question_id === row.item.q_id).length}}</span>
							<span v-else>Открытый ответ</span>
						</template>
					</b-table>
				</b-card>
			</template>
			<template #cell(edit)="row">
<!--				<div>-->
					<b-button variant="outline-warning" class="mr-2" @click="show_parallel_block_modal_window(row.item.p_b_id)">Изменить</b-button>
<!--				</div>-->
<!--				<button class="btn-edit" @click="show_parallel_block_modal_window(row.item.p_b_id)">Изменить</button>-->
			</template>
			<template #cell(delete)="row">
<!--				<div>-->
					<b-button variant="outline-danger" class="mr-2" @click="handle_remove_parallel_block(row.item.p_b_id)">Удалить</b-button>
<!--				</div>-->
<!--				<button class="btn-delete" @click="handle_remove_parallel_block(row.item.p_b_id)">Удалить</button>-->
			</template>
		</b-table>

		<div class="answ-modal">
			<b-modal
				id="answer-modal"
				ref="answer-modal"
				no-fade
				title="Редактирование ответа"
			>
				<template #modal-header="{ close }">
					<!-- Эмулировать встроенное модальное действие кнопки закрытия заголовка -->
					<b>Редактирование ответа</b>
				</template>
				<template #default>
					<b-form>
						<b-form-group label="Текст ответа"
													label-for="answer-text-input">
							<b-form-input id="answer-text-input" v-model="answer_item.answ_text"
														placeholder="Введите текст ответа" required>

							</b-form-input>
						</b-form-group>
						<b-form-group label="Является правильным?"
													label-for="answer-correct-input">
							<b-form-radio-group id="answer-correct-input" v-model="answer_item.is_correct">
								<b-form-radio :value="true">Да</b-form-radio>
								<b-form-radio :value="false">Нет</b-form-radio>
							</b-form-radio-group>
						</b-form-group>
					</b-form>

				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
					<b-button size="sm" variant="outline-success" @click="handleSubmitAnswer($event)">
						Сохранить
					</b-button>
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Выход
					</b-button>
				</template>
			</b-modal>
		</div>
		<div class="q-modal">
			<b-modal
				id="question-modal"
				ref="question-modal"
				no-fade
				title="Редактирование вопроса"
			>
				<template #modal-header="{ close }">
					<!-- Эмулировать встроенное модальное действие кнопки закрытия заголовка -->
					<b>Редактирование вопроса</b>
				</template>
				<template #default>
					<b-form @submit="handle_submit_new_question" id="add-q-form">
						<b-form-group label="Текст вопроса"
													label-for="question-text-input">
							<b-form-input required class="style-input" id="question-text-input"
														v-model="question_item.q_title"
														placeholder="Введите текст вопроса" >
							</b-form-input>
						</b-form-group>
						<b-form-group label="Тип вопроса" label-for="q-type-selector">
							<b-form-select id="q-type-selector" v-model="question_item.q_type"
															 :options="question_types_list" value-field="type_q_id" text-field="type_q"></b-form-select>
						</b-form-group>
					</b-form>
				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
					<b-button size="sm" variant="outline-success" form="add-q-form" type="submit">
						Сохранить
					</b-button>
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Выход
					</b-button>
				</template>
			</b-modal>
		</div>
		<div class="parallel-block-modal">
			<b-modal
				id="p-b-modal" ref="p-b-modal" no-fade title="Параллельный блок">
				<template #modal-header="{ close }">
					<!-- Эмулировать встроенное модальное действие кнопки закрытия заголовка -->
					<b>Редактирование блока</b>
				</template>
				<template #default>
					<b-form>
						<b-form-group label="Название блока"
													label-for="p-b-name-input">
							<b-form-input class="style-input" id="p-b-name-input" v-model="p_b_item.p_b_name"
														placeholder="Введите название блока" required>
							</b-form-input>
						</b-form-group>
					</b-form>
				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
					<b-button size="sm" variant="outline-success" @click="handle_submit_parallel_block($event)">
						Сохранить
					</b-button>
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Выход
					</b-button>
				</template>
			</b-modal>
		</div>
		<div class="comparison-answer-modal">
			<b-modal
				id="comparison-answer-modal"
				ref="comparison-answer-modal"
				no-fade
				title="Редактирование ответа"
			>
				<template #modal-header="{ close }">
					<!-- Эмулировать встроенное модальное действие кнопки закрытия заголовка -->
					<b>Редактирование ответа</b>
				</template>
				<template #default>
					<b-form>
						<b-form-group label="Первая часть"
													label-for="answer-text-1-input">
							<b-form-input class="style-input"  id="answer-text-1-input" v-model="answer_item.answ_text"
														placeholder="Введите текст ответа" required>

							</b-form-input>
						</b-form-group>
						<b-form-group label="Вторая часть"
													label-for="answer-text-2-input">
							<b-form-input class="style-input"  id="answer-text-2-input" v-model="answer_item.answ_comparison_text"
														placeholder="Введите текст ответа" required>

							</b-form-input>
						</b-form-group>
					</b-form>

				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
					<b-button size="sm" variant="outline-success" @click="handleSubmitAnswer($event)">
						Сохранить
					</b-button>
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Выход
					</b-button>
				</template>
			</b-modal>
		</div>
		<div class="edit-standard-question-modal">
			<b-modal
				id="edit-standard-question-modal" ref="edit-standard-question-modal" no-fade
				title="Редактирование вопроса" size="lg" @hide="on_hide_standard_question_modal"
			>
				<template #modal-header="{ close }">
					<!-- Эмулировать встроенное модальное действие кнопки закрытия заголовка -->
					<b>Редактирование вопроса</b>
				</template>
				<template #default>
					<div>
						<b-form-group label="Текст вопроса"
													label-for="question-text-input">
							<b-form-input @blur="handle_submit_edited_standard_question($event)" id="question-text-input"
														v-model="edit_question_item.q_title"
														class="style-input"
														placeholder="Введите текст вопроса" required>
							</b-form-input>
						</b-form-group>

						<b-form id="add-answ-form" @submit="handle_submit_answer($event, selected_question_id)" inline>
							<b-input required v-model="new_answer_item.answ_text" class="style-input" placeholder="Добавление ответа"></b-input>
							<b-form-checkbox size="lg" switch button-variant="outline-primary" class="standard-answ-correct-switch"
															 v-model="new_answer_item.is_correct">Правильный?</b-form-checkbox>
							<b-button variant="outline-primary" type="submit">Добавить</b-button>
						</b-form>
						<b-form-group>
							<b-table
								id = "answer-table" fixed
								:items="filtered_answer_items"
								:fields="answer_fields"
								responsive="sm"
							>
								<template #table-colgroup="scope">
									<col :key="scope.fields.answ_id" style="width: 8%">
									<col :key="scope.fields.answ_text" style="width: 67%">
									<col :key="scope.fields.is_correct" style="width: 15%">
									<col :key="scope.fields.delete" style="width: 20%">
								</template>
								<template #cell(answ_text)="data">
									<div>
										<b-form-group>
											<b-form-input class="style-input"
																		@blur="handle_submit_filtered_answer(data.item.answ_id)"
																		v-model="filtered_answer_items.find(item => item.answ_id === data.item.answ_id).answ_text">
											</b-form-input>
										</b-form-group>
									</div>
								</template>
								<template #cell(is_correct)="data">
									<b-form-checkbox size="lg" @change="handle_submit_filtered_answer(data.item.answ_id)"
																	 v-model="filtered_answer_items.find(item => item.answ_id === data.item.answ_id).is_correct"></b-form-checkbox>
								</template>
								<template #cell(delete)="data">
									<div>
										<b-button variant="outline-danger" @click="show_ans_delete_msg_box($event, data.item.answ_id)">Удалить</b-button>
									</div>
								</template>
							</b-table>
						</b-form-group>
					</div>
				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Выход
					</b-button>
				</template>
			</b-modal>
		</div>
		<div class="comparison-question-modal">
			<b-modal
				id="comparison-question-modal" ref="comparison-question-modal" no-fade
				title="Редактирование вопроса" size="lg"
			>
				<template #modal-header="{ close }">
					<!-- Эмулировать встроенное модальное действие кнопки закрытия заголовка -->
					<b>Редактирование вопроса</b>
				</template>
				<template #default>
					<div>
						<b-form-group label="Текст вопроса"
													label-for="question-text-input">
							<b-form-input @blur="handle_submit_edited_standard_question($event)" id="question-text-input"
														v-model="edit_question_item.q_title"
														class="style-input"
														placeholder="Введите текст вопроса" required>
							</b-form-input>
						</b-form-group>
						<h6>Добавление ответа</h6>
						<b-form @submit="handle_submit_answer($event, selected_question_id)">
							<b-input-group>
								<b-input placeholder="Первая часть" class="style-input" required
												 v-model="new_answer_item.answ_text">Первая часть</b-input>
								<b-input placeholder="Вторая часть" class="style-input" required
												 v-model="new_answer_item.answ_comparison_text">Вторая часть</b-input>
								<b-button variant="outline-primary" type="submit">Добавить</b-button>
							</b-input-group>
						</b-form>
						<b-form-group>
							<b-table
								id = "answer-table" fixed
								:items="filtered_answer_items"
								:fields="comparison_answer_fields"
								responsive="sm"
							>
								<template #table-colgroup="scope">
									<col :key="scope.fields.answ_id" style="width: 7%">
									<col :key="scope.fields.answ_text" style="width: 34%">
									<col :key="scope.fields.answ_comparison_text" style="width: 34%">
									<col :key="scope.fields.delete" style="width: 20%">
								</template>
								<template #cell(answ_text)="data">
									<div>
										<b-form-group>
											<b-form-input required class="style-input"
																		@blur="handle_submit_filtered_answer(data.item.answ_id)"
																		v-model="filtered_answer_items.find(item => item.answ_id === data.item.answ_id).answ_text">
											</b-form-input>
										</b-form-group>
									</div>
								</template>
								<template #cell(answ_comparison_text)="data">
									<div>
										<b-form-group>
											<b-form-input required class="style-input"
																		@blur="handle_submit_filtered_answer(data.item.answ_id)"
																		v-model="filtered_answer_items.find(item => item.answ_id === data.item.answ_id).answ_comparison_text">
											</b-form-input>
										</b-form-group>
									</div>
								</template>
								<template #cell(delete)="data">
									<div>
										<b-button variant="outline-danger" @click="show_ans_delete_msg_box($event, data.item.answ_id)">Удалить</b-button>
									</div>
								</template>
							</b-table>
						</b-form-group>
					</div>
				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
<!--					<b-button size="sm" variant="outline-success" @click="handle_submit_edited_standard_question($event)">-->
<!--						Сохранить-->
<!--					</b-button>-->
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Выход
					</b-button>
				</template>
			</b-modal>
		</div>
		<div class="edit-open-question-modal">
			<b-modal
				id="edit-open-question-modal" ref="edit-open-question-modal" no-fade
				title="Редактирование вопроса" size="lg" @hide="on_hide_standard_question_modal"
			>
				<template #modal-header="{ close }">
					<!-- Эмулировать встроенное модальное действие кнопки закрытия заголовка -->
					<b>Редактирование вопроса</b>
				</template>
				<template #default>
					<div>
						<b-form-group label="Текст вопроса"
													label-for="question-text-input">
							<b-form-input @blur="handle_submit_edited_standard_question($event)" id="question-text-input"
														v-model="edit_question_item.q_title"
														class="style-input"
														placeholder="Введите текст вопроса" required>
							</b-form-input>
						</b-form-group>

						<b-input required @blur="handle_submit_filtered_answer(filtered_answer_items.find(item => item.answ_question_id === selected_question_id).answ_id)"
										 v-model="filtered_answer_items.find(item => item.answ_question_id === selected_question_id).answ_text"
										 class="style-input" placeholder="Открытый ответ"></b-input>

					</div>
				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Выход
					</b-button>
				</template>
			</b-modal>
		</div>
	</div>
</template>

<script>
import {authenticationService} from "../authentication.service";
import {Question_Types} from "../utils";

export default {
	created() {
		// this.$store.dispatch('initPassingQuestions');
		// this.$store.dispatch('initAnswers');
	},
	mounted() {
		this.$store.dispatch('initPassingQuestions');
		this.$store.dispatch('initAnswers');
		this.$store.dispatch('initQuestionTypes');
		this.$store.dispatch('init_parallel_blocks');
		this.random_sort = this.current_test.test_random_sort
	},
	data() {
		return {
			random_sort: true,
			Question_Types,
			id: parseInt(this.$route.params.id),
			fields: ['q_id', 'q_title', 'q_type', 'answ_count', 'edit', 'delete',],
			p_b_fields: ['p_b_id', 'p_b_name', 'questions', 'edit', 'delete'],
			answer_fields: ['answ_id', 'answ_text', 'is_correct', 'delete'],
			comparison_answer_fields: ['answ_id', 'answ_text', 'answ_comparison_text', 'delete'],

			q_title: "",
			q_test_id: parseInt(this.$route.params.id),
			parallel_connection: false,

			answ_text: "",
			answ_question_id: 0,
			is_correct: false,

			is_new: true,
			is_q_new: true,

			name_edit_question_item: {
				q_id: 0,
				q_title: "",
				q_test_id: parseInt(this.$route.params.id)
			},
			answer_item: {
				answ_id: 0,
				answ_text: "",
				answ_question_id: 0,
				is_correct: false,
				answ_comparison_text: ""
			},
			question_item: {
				q_id: 0,
				q_title: "",
				q_test_id: parseInt(this.$route.params.id),
				q_connection_id: 0,
				q_type: 1,
				q_parallel_block_id: 0
			},
			p_b_item: {
				p_b_name: "Параллельный блок",
				p_b_test_id: parseInt(this.$route.params.id)
			},
			p_b_is_new: true,
			currentUser: JSON.parse(localStorage.getItem('currentUser')),
			selected: [],
			selected_question_id: 0,

			edit_question_item: {
				q_id: 0,
				q_title: "",
				q_test_id: parseInt(this.$route.params.id),
				q_connection_id: 0,
				q_type: 1,
				q_parallel_block_id: 0
			},
			new_answer_item: {
				answ_id: 0,
				answ_text: "",
				answ_question_id: 0,
				is_correct: false,
				answ_comparison_text: ""
			},
			// current_test: this.$store.state.tests.find(item => item.test_id === parseInt(this.$route.params.id)),
			name_subject_editing: false,
			name_editing_item: {
				test_id: parseInt(this.$route.params.id),
				test_name: "123",
				test_subject: "123,"
			}
		};
	},
	name: "TestPage",

	methods: {
		async submit_new_sort() {
			const item = {
				test_id: parseInt(this.$route.params.id),
				test_random_sort: !this.random_sort
			}
			await this.$store.dispatch('editTestItem', item)
			await this.$store.dispatch('initTest')
		},
		show_name_editing() {
			this.name_editing_item.test_name = this.current_test.test_name;
			this.name_editing_item.test_subject = this.current_test.test_subject
			this.name_subject_editing = true
		},
		async submit_new_name(e) {
			e.preventDefault()
			await this.$store.dispatch('editTestItem', this.name_editing_item)
			await this.$store.dispatch('initTest')
			this.name_subject_editing = false
		},
		showToast() {
			this.$bvToast.toast('Данные успешно сохранены',{
				toaster: 'b-toaster-top-center',
				variant: 'success',
				title: "Успешно"
			})
		},
		showAnswerModalWindow(answ_id, q_id, comparison=false) {
			if (answ_id === 0) {
				this.answer_item.answ_id = 0
				this.answer_item.answ_text = ""
				this.answer_item.answ_question_id = q_id
				this.answer_item.answ_comparison_text = ""
				this.answer_item.is_correct = false
				this.is_new = true
			} else {
				const item = this.answersList.find(item => item.answ_id === answ_id)
				this.answer_item.answ_id = answ_id
				this.answer_item.answ_text = item.answ_text
				this.answer_item.answ_question_id = item.answ_question_id
				this.answer_item.is_correct = item.is_correct
				this.answer_item.answ_comparison_text = item.answ_comparison_text
				this.is_new = false
			}
			if (comparison) {
				this.$bvModal.show('comparison-answer-modal')
			} else {
				this.$bvModal.show('answer-modal')
			}
		},
		showQuestionModalWindow(q_id, p_b_id=null) {
			this.selected_question_id = q_id
			this.question_item.q_parallel_block_id = p_b_id
			if (q_id === 0) {
				this.question_item.q_id = 0
				this.question_item.q_title = ""
				this.question_item.q_connection_id = 0
				this.question_item.q_type = 1
				this.is_q_new = true
			} else {
				const item = this.$store.state.questions.find(item => item.q_id === q_id)
				this.question_item.q_id = item.q_id
				this.question_item.q_title = item.q_title
				this.question_item.q_connection_id = item.q_connection_id
				this.question_item.q_type = item.q_type
				this.question_item.q_parallel_block_id = item.q_parallel_block_id
				this.is_q_new = false
			}
			this.$bvModal.show('question-modal')
		},
		show_parallel_block_modal_window(p_b_id) {
			if (p_b_id === 0) {
				this.p_b_is_new = true
			} else {
				this.p_b_is_new = false
				const item = this.parallel_blocks_list.find(item => item.p_b_id === p_b_id)

				this.p_b_item.p_b_name = item.p_b_name
				this.p_b_item.p_b_id = item.p_b_id
			}
			this.$bvModal.show('p-b-modal')
		},
		logout() {
			authenticationService.logout();
			this.$router.push("/login");
		},
		async showMsgBoxOne(e, id, type) {
			this.$bvModal.msgBoxConfirm('Вы уверены, что хотите удалить '+ type +'?', {
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
						switch (type) {
							case 'вопрос':
								this.handleRemoveQuestion(e, id)
								break
							case 'ответ':
								this.handleRemoveAnswers(e, id)
								break
						}
					}
				})
				.catch(err => {
					// An error occurred
				})
		},

		async handleRemoveQuestion(e, id) {
			e.preventDefault()
			await this.$store.dispatch("removeQuestionItem", id);
			await this.$store.dispatch('initQuestions')
		},
		async handleRemoveAnswers(e, id) {
			e.preventDefault()
			await this.$store.dispatch("removeAnswerItem", id);
			await this.$store.dispatch('initAnswers')
		},

		async handle_submit_new_question(e) {
			e.preventDefault()
			if (!this.question_item.q_title) {
				return
			}

			let response = await this.$store.dispatch('addQuestionItem', this.question_item)
			await this.$store.dispatch('initQuestions')
			await this.$store.dispatch('initExpandQuestions')
			// alert(JSON.stringify(response))
			if (this.question_item.q_type === Question_Types.Open_answer) {
				let q_id = response.data.q_id
				let answer_item = {
					answ_id: 0,
					answ_text: "Текст вопроса",
					answ_question_id: q_id,
					is_correct: true,
				}
				await this.$store.dispatch('addAnswerItem', answer_item)
			}

			this.$bvModal.hide('question-modal')
		},
		async handleSubmitAnswer(e) {
			e.preventDefault()
			if (this.is_new) {
				await this.$store.dispatch('addAnswerItem', this.answer_item)
				this.$bvModal.hide('answer-modal')
			} else {
				await this.$store.dispatch('editAnswerItem', this.answer_item)
				this.showToast()
			}
		},
		async handle_submit_parallel_block(e) {
			e.preventDefault()
			if (this.p_b_is_new){
				await this.$store.dispatch('add_parallel_block_item', this.p_b_item)
			} else {
				await this.$store.dispatch('edit_parallel_block_item', this.p_b_item)
			}

			this.p_b_item.p_b_id = 0
			this.p_b_item.p_b_name = ""
			this.$bvModal.hide('p-b-modal')
		},
		async handle_submit_answer(e, q_id) {
			e.preventDefault()
			this.new_answer_item.answ_question_id = this.selected_question_id
			let selected_q_type = this.questionsList.find(item => item.q_id === q_id).q_type

			if (selected_q_type !== Question_Types.Comparison) {
				this.new_answer_item.answ_comparison_text = null
			}
			await this.$store.dispatch('addAnswerItem', this.new_answer_item)
			await this.$store.dispatch('initAnswers')

			this.new_answer_item.answ_text = ""
			this.new_answer_item.is_correct = false
			this.new_answer_item.answ_comparison_text = ""
		},
		async handle_submit_edited_standard_question(e) {
			e.preventDefault()

			if (this.edit_question_item.q_title) {
				await this.$store.dispatch('editQuestionItem', this.edit_question_item)
			}

			// for (let i = 0; i < this.filtered_answer_items.length; i++) {
			// 	let obj = this.filtered_answer_items[i]
			// 	await this.$store.dispatch('editAnswerItem', obj)
			// }
			// await this.$store.dispatch('initQuestions')
			// await this.$store.dispatch('initExpandQuestions')
			// await this.$store.dispatch('initAnswers')
		},
		async handle_submit_filtered_answer(a_id) {
			// e.preventDefault()
			const item = this.filtered_answer_items.find(item => item.answ_id === a_id)
			if (item.answ_text === "" || item.answ_comparison_text === ""){
				await this.$store.dispatch('initAnswers')
				return
			}
			await this.$store.dispatch('editAnswerItem', item)
			// await this.$store.dispatch('initAnswers')
		},
		show_question_modal(q_id, q_type) {
			this.selected_question_id = q_id

			const item = this.questionsList.find(item => item.q_id === q_id)
			this.edit_question_item = {
				q_id: q_id,
				q_title: item.q_title
			}

			if (q_type === Question_Types.Comparison) {
				this.$bvModal.show('comparison-question-modal')
			} else if (q_type === Question_Types.Standard) {
				this.$bvModal.show('edit-standard-question-modal')
			} else {
				this.$bvModal.show('edit-open-question-modal')
			}
		},
		handle_remove_parallel_block(p_b_id) {
			this.$store.dispatch('remove_parallel_block_item', p_b_id)
			this.$store.dispatch('init_parallel_blocks')
		},
		async on_hide_standard_question_modal() {
			this.new_answer_item.answ_text = ""
			await this.$store.dispatch('initQuestions')
			await this.$store.dispatch('initExpandQuestions')
			await this.$store.dispatch('initAnswers')
		},
		async show_ans_delete_msg_box(e, id) {
			this.$bvModal.msgBoxConfirm('Вы уверены, что хотите удалить?', {
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
						this.handleRemoveAnswers(e, id)
					}
				})
				.catch(err => {
					// An error occurred
				})
		},
	},
	computed: {
		questionsList() {
			return this.$store.state.questions.filter(item => item.q_test_id === parseInt(this.$route.params.id)).sort((a, b) => a.q_id - b.q_id);
		},
		answersList() {
			return this.$store.state.answers.sort((a, b) => a.answ_id - b.answ_id);
		},
		question_types_list() {
			return this.$store.state.question_types
		},
		parallel_blocks_list() {
			 return this.$store.state.parallel_blocks.filter(item => item.p_b_test_id === parseInt(this.$route.params.id) )
		},
		filtered_answer_items(){
			return this.$store.state.answers.filter(item => item.answ_question_id === this.selected_question_id)
				.sort((a,b) => a.answ_id - b.answ_id)
		},
		current_test() {
			return this.$store.state.tests.find(item => item.test_id === parseInt(this.$route.params.id))
		}
	},

}
</script>

<style scoped>
@import "/static/css/style.css";

.input_wrapper{
	width: 80px;
	height: 40px;
	position: relative;
	/*cursor: pointer;*/
}

.input_wrapper input[type="checkbox"]{
	width: 80px;
	height: 40px;
	/*cursor: pointer;*/
	-webkit-appearance: none;
	-moz-appearance: none;
	appearance: none;
	background: #315e7f;
	border-radius: 2px;
	position: relative;
	outline: 0;
	-webkit-transition: all .2s;
	transition: all .2s;
}

.input_wrapper input[type="checkbox"]:after{
	position: absolute;
	/*content: "";*/
	top: 3px;
	left: 3px;
	width: 34px;
	height: 34px;
	background: #dfeaec;
	z-index: 2;
	border-radius: 2px;
	-webkit-transition: all .35s;
	transition: all .35s;
}

.input_wrapper svg{
	position: absolute;
	top: 50%;
	-webkit-transform-origin: 50% 50%;
	transform-origin: 50% 50%;
	fill: #fff;
	-webkit-transition: all .35s;
	transition: all .35s;
	z-index: 1;
}

.input_wrapper .is_checked{
	width: 18px;
	left: 18%;
	-webkit-transform: translateX(190%) translateY(-30%) scale(0);
	transform: translateX(190%) translateY(-30%) scale(0);
}

.input_wrapper .is_unchecked{
	width: 15px;
	right: 10%;
	-webkit-transform: translateX(0) translateY(-30%) scale(1);
	transform: translateX(0) translateY(-30%) scale(1);
}

/* Checked State */
.input_wrapper input[type="checkbox"]:checked{
	background: #23da87;
}

.input_wrapper input[type="checkbox"]:checked:after{
	left: calc(100% - 37px);
}

.input_wrapper input[type="checkbox"]:checked + .is_checked{
	-webkit-transform: translateX(0) translateY(-30%) scale(1);
	transform: translateX(0) translateY(-30%) scale(1);
}

.input_wrapper input[type="checkbox"]:checked ~ .is_unchecked{
	-webkit-transform: translateX(-190%) translateY(-30%) scale(0);
	transform: translateX(-190%) translateY(-30%) scale(0);
}
input[type="checkbox"]:checked:before{
	visibility: hidden;
}



.title1 div {
	display: inline-block;
	color: #00ff7f; /* #34c924 #00ff7f #32cd32*/
}

li {
	list-style-type: none;
	display: inline-flex;
	padding: 5px;
	margin: 5px;
}

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

.standard-answ-correct-switch {
	padding-bottom: 5%;
	margin-left: 2%;
	margin-right: 2%;
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
	font-size: 1.5rem;
	cursor: pointer;
	border: none;
	margin: .1em;
}

</style>
