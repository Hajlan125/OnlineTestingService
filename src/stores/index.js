import Vue from "vue";
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import AnswerService from "../Services/AnswerService";
import QuestionService from "../Services/QuestionService";
import ScoreService from "../Services/ScoreService";
import TestingSystemService from "../Services/TestingSystemService";
import TestService from "../Services/TestService";
import UserService from "../Services/UserService";

import axios from "axios";
import UserTypeService from "../Services/UserTypeService";
import TestTypeService from "../Services/TestTypeService";
import QuestionTypeService from "../Services/QuestionTypeService";
import ParallelBlockService from "../Services/ParallelBlockService";

Vue.use(Vuex)

export const store = new Vuex.Store({
	plugins: [createPersistedState({
		storage: window.sessionStorage,
	})],
	state: {
		answers: [],
		users: [],
		questions: [],
		expandQuestions: [],
		user_types: [],
		testingSystems: [],
		tests: [],
		alertText: "",
		currentTest: [],
		test_types: [],
		question_types: [],
		parallel_blocks: []
	},
	getters: {

	},
	mutations: {
		'SET_PARALLEL_BLOCKS'(state, parallel_blocks){
			state.parallel_blocks = parallel_blocks;
		},
		'SET_QUESTION_TYPES'(state, question_types){
			state.question_types = question_types;
		},
		'SET_TEST_TYPES'(state, test_types){
			state.test_types = test_types;
		},
		'SET_USER_TYPES'(state, user_types){
			state.user_types = user_types;
		},
		'SET_CURRENT_TEST'(state, test){
			state.currentTest = test;
		},
		'SET_PASSING_QUESTION'(state, questions) {
			state.questions = questions;
		},
		'SET_ANSWERS'(state, answers){
			state.answers = answers;
		},
		'SET_USERS'(state, users) {
			state.users = users;
		},
		'SET_QUESTIONS'(state, questions) {
			state.questions = questions;
		},
		'SET_EXPAND_QUESTIONS'(state, questions) {
			state.expandQuestions = questions;
		},
		'SET_SCORES'(state, scores) {
			state.scores = scores;
		},
		'SET_TESTING_SYSTEMS'(state, testingSystem) {
			state.testingSystems = testingSystem;
		},
		'SET_TESTS'(state, tests) {
			state.tests = tests;
		},
		'SET_ALERT_TEXT'(state, alertText) {
			state.alertText = alertText;
		},

		'ADD_PARALLEL_BLOCK_ITEM'(state, p_b_item){
			state.parallel_blocks.push(p_b_item)
		},
		'ADD_USER_TYPE_ITEM'(state, type) {
			state.user_types.push(type)
		},
		'ADD_ANSWER_ITEM'(state, answer) {
			state.answers.push(answer);
		},
		'ADD_QUESTION_ITEM'(state, question) {
			state.questions.push(question);
		},
		'ADD_USER_ITEM'(state, user) {
			state.users.push(user);
		},
		'ADD_TESTING_SYSTEM_ITEM'(state, testingSystem) {
			state.testingSystems.push(testingSystem);
		},
		'ADD_TEST_ITEM'(state, test) {
			state.tests.push(test)
		},

		'EDIT_USER_TYPE_ITEM' (state, type) {
			const item = state.user_types.find(item => item.type_u_id === type.type_u_id)
			Object.assign(item, type)
		},
		'EDIT_ANSWER_ITEM'(state, answer) {
			const item = state.answers.find(item => item.answ_id === answer.answ_id);
			Object.assign(item, answer);
		},
		'EDIT_SCORE_ITEM'(state, score) {
			const item = state.scores.find(item => item.score_id === score.score_id);
			Object.assign(item, score)
		},
		'EDIT_USER_ITEM'(state, user) {
			const item = state.users.find(item => item.user_id === user.user_id);
			Object.assign(item, user);
		},
		'EDIT_QUESTION_ITEM'(state, question) {
			const item = state.questions.find(item => item.q_id === question.q_id);
			Object.assign(item, question);
		},
		'EDIT_TESTING_SYSTEM_ITEM'(state, testingSystem) {
			const item = state.testingSystems.find(item => item.id === testingSystem.id)
			Object.assign(item, item);
		},
		'EDIT_TEST_ITEM'(state, test) {
			const item = state.tests.find(item => item.id === test.id)
			Object.assign(item, item);
		},

		'REMOVE_ANSWER_ITEM'(state, answer) {
			const index = state.answers.findIndex(item => item.answ_id === answer.answ_id);
			state.answers.splice(index, 1);
		},
		'REMOVE_USER_ITEM'(state, user)  {
			const index = state.users.findIndex(item => item.user_id === user.user_id);
			state.users.splice(index, 1);
		},
		'REMOVE_QUESTION_ITEM'(state, question) {
			const index = state.questions.findIndex(item => item.q_id === question.q_id);
			state.questions.splice(index, 1);
		},
		'REMOVE_TESTING_SYSTEM_ITEM'(state, testingSystem) {
			const index = state.testingSystems.findIndex(item => item.ts_id === testingSystem.ts_id);
			state.testingSystems.splice(index, 1);
		},
		'REMOVE_TEST_ITEM'(state, test) {
			const index = state.tests.findIndex(item => item.test_id === test.test_id);
			state.tests.splice(index, 1);
		}

	},
	actions: {
		async init_parallel_blocks(context) {
			try {
				const response = await ParallelBlockService.get_parallel_blocks();
				context.commit('SET_PARALLEL_BLOCKS', response.data);
			} catch (error) {
				alert('init parallel blocks ERROR')
			}
		},
		async initQuestionTypes(context) {
			try {
				const response = await QuestionTypeService.get_question_types();
				context.commit('SET_QUESTION_TYPES', response.data);
			} catch (error) {
				alert('init question type ERROR')
			}
		},
		async initTestType(context) {
			try {
				const response = await TestTypeService.get_test_types();
				context.commit('SET_TEST_TYPES', response.data);
			} catch (error) {
				alert('init test types ERROR')
			}
		},
		async initUserTypes(context) {
			try {
				const response = await UserTypeService.get_user_list();
				context.commit('SET_USER_TYPES', response.data);
			} catch (error) {
				// context.commit('SET_ALERT_TEXT', "ERROR");
				alert('initUserType ERROR')
			}
		},
		async initCurrentTest(context, id) {
			try {
				const response = await TestService.getTestById(id);
				context.commit('SET_CURRENT_TEST', response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR");
				// alert('initCurrentTestError')
			}
		},
		async removeAlertText(context) {
			context.commit('SET_ALERT_TEXT', "NORMAL")
		},

		async initPassingQuestions(context, id) {
			try {
				const response = await QuestionService.getPassingQuestions();
				context.commit('SET_PASSING_QUESTION', response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR");
			}
		},

		async initUsers(context) {
			try {
				const response = await UserService.getUsers();
				context.commit('SET_USERS', response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert(error)
			}
		},
		async initAnswers(context) {
			try {
				const response = await AnswerService.getAnswers();
				context.commit('SET_ANSWERS', response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert("error")
			}
		},
		async initQuestions(context) {
			try {
				const response = await QuestionService.getQuestions();
				context.commit('SET_QUESTIONS', response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert("init questions error")
			}
		},
		async initExpandQuestions(context) {
			try {
				const response = await QuestionService.getExpandQuestions();
				context.commit('SET_EXPAND_QUESTIONS', response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert("init expand questions error")
			}
		},
		async initTestingSystem(context) {
			try {
				const response = await TestingSystemService.getTestingSystem();
				context.commit('SET_TESTING_SYSTEMS', response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert("error")
			}
		},
		async initScore(context) {
			try {
				const response = await ScoreService.getScores();
				context.commit('SET_SCORES', response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert("error")
			}
		},
		async initTest(context) {
			try {
				const response = await TestService.getTests();
				context.commit('SET_TESTS', response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert("initTest error")
			}
		},

		async add_parallel_block_item(context, item) {
			try {
				const response = await ParallelBlockService.post_parallel_block(item);
				context.commit("ADD_PARALLEL_BLOCK_ITEM", response.data);
			} catch (error) {
				alert('add_parallel_block_item ERROR')
			}
		},
		async add_user_type_item(context, item) {
			try {
				const response = await UserTypeService.post_user_type(item);
				context.commit("ADD_USER_TYPE_ITEM", response.data);
			} catch (error) {
				alert('add_user_type error')
				context.commit("SET_ALERT_TEXT", "ERROR TRY AGAIN");
			}
		},
		async addAnswerItem(context, item) {
			try {
				const response = await AnswerService.postAnswer(item);
				context.commit("ADD_ANSWER_ITEM", response.data);
			} catch (error) {
				context.commit("SET_ALERT_TEXT", "ERROR TRY AGAIN");
			}
		},
		async addUserItem(context, item) {
			try {
				const response = await UserService.postUser(item);
				context.commit("ADD_USER_ITEM", response.data);
			} catch (error) {
				context.commit("SET_ALERT_TEXT", "ERROR");
			}
		},
		async addQuestionItem(context, item) {
			try {
				let response = await QuestionService.postQuestion(item)
				context.commit("ADD_QUESTION_ITEM", response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert("error")
			}
		},
		async addTestingSystemItem(context, item) {
			try {
				const response = await TestingSystemService.postTestingSystem(item);
				context.commit("ADD_TESTING_SYSTEM_ITEM", response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert("error")
			}
		},
		async addTestItem(context, item) {
			try {
				const response = await TestService.postTest(item);
				context.commit("ADD_TEST_ITEM", response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert("error")
			}
		},

		async edit_user_type_item(context, item){
			try {
				const response = await UserTypeService.put_user_type(item.type_u_id, item);
				context.commit("EDIT_USER_TYPE_ITEM", response.data);
			} catch (error) {
				context.commit("SET_ALERT_TEXT", "ERROR TRY AGAIN");
			}
		},
		async editAnswerItem(context, item) {
			try {
				const response = await AnswerService.putAnswer(item.answ_id, item);
				context.commit("EDIT_ANSWER_ITEM", response.data);
			} catch (error) {
				context.commit("SET_ALERT_TEXT", "ERROR TRY AGAIN");
			}
		},
		async editUserItem(context, item) {
			try {
				const response = await UserService.putUser(item.user_id, item);
				context.commit("EDIT_USER_ITEM", response.data);
			} catch (error) {
				context.commit("SET_ALERT_TEXT", "ERROR");
			}
		},
		async editScoreItem(context, item) {
			try {
				const response = await ScoreService.putScore(item.score_id, item)
				context.commit("EDIT_SCORE_ITEM", response.data);
			} catch (error) {
				context.commit("SET_ALERT_TEXT", "ERROR");
			}
		},
		async editQuestionItem(context, item) {
			try {
				const response = await QuestionService.putQuestion(item.q_id, item);
				context.commit("EDIT_QUESTION_ITEM", response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert(error)
			}
		},
		async editTestingSystemItem(context, item) {
			try {
				const response = await TestingSystemService.putTestingSystem(item.id, item);
				context.commit("EDIT_TESTING_SYSTEM_ITEM", response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert("error")
			}
		},
		async editTestItem(context, item) {
			try {
				const response = await TestService.putTest(item.test_id, item);
				context.commit("EDIT_TEST_ITEM", response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert("editTestItem error")
			}
		},

		async removeAnswerItem(context, id) {
			try {
				const response = await AnswerService.deleteAnswer(id);
				context.commit("REMOVE_ANSWER_ITEM", response.data);
			} catch (error) {
				context.commit("SET_ALERT_TEXT", "ERROR TRY AGAIN");
			}
		},
		async removeUserItem(context, id) {
			try {
				const response = await UserService.deleteUser(id);
				context.commit("REMOVE_USER_ITEM", response.data);
			} catch (error) {
				context.commit("SET_ALERT_TEXT", "ERROR")
			}
		},
		async removeQuestionItem(context, id) {
			try {
				const response = await QuestionService.deleteQuestion(id);
				context.commit("REMOVE_QUESTION_ITEM", response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert("error")
			}
		},
		async removeTestingSystemItem(context, id) {
			try {
				const response = await TestingSystemService.deleteTestingSystem(id);
				context.commit("REMOVE_TESTING_SYSTEM_ITEM", response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert("error")
			}
		},
		async removeTestItem(context, id) {
			try {
				const response = await TestService.deleteTest(id);
				context.commit("REMOVE_TEST_ITEM", response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert("error")
			}
		}
	}
})
