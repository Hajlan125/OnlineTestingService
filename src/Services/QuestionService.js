import axios from "axios";
import {BASE_URL} from "../utils";

const QUESTION_API_BASE_URL = BASE_URL + 'question'

class QuestionService{
	getQuestions() {
		return axios.get(`${QUESTION_API_BASE_URL}`)
	}
	getExpandQuestions() {
		return axios.get(`${QUESTION_API_BASE_URL}?expand`)
	}
	getPassingQuestions() {
		return axios.get(`${QUESTION_API_BASE_URL}?passing_expand`)
	}
	getQuestionById(id) {
		return axios.get(`${QUESTION_API_BASE_URL}/${id}`)
	}
	postQuestion(item) {
		return axios.post(`${QUESTION_API_BASE_URL}`, item)
	}
	post_parallel_question(item) {
		return axios.post(`${QUESTION_API_BASE_URL}?parallel`, item)
	}
	putQuestion(id, item) {
		return axios.put(`${QUESTION_API_BASE_URL}/${id}`, item)
	}
	deleteQuestion(id) {
		return axios.delete(`${QUESTION_API_BASE_URL}/${id}`)
	}
}

export default new QuestionService();
