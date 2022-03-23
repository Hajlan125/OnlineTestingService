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
		scores: [],
		testingSystems: [],
		tests: [],
		alertText: "",
		currentTest: [],
	},
	getters: {

	},
	mutations: {
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
				const response = await QuestionService.postQuestion(item);
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
				const response = await TestService.putTest(item.id, item);
				context.commit("EDIT_TEST_ITEM", response.data);
			} catch (error) {
				context.commit('SET_ALERT_TEXT', "ERROR TRY AGAIN");
				alert("error")
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
