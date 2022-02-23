import axios from "axios";

const QUESTION_API_BASE_URL = 'http://localhost:8000/question'

class QuestionService{
	getQuestions() {
		return axios.get(`${QUESTION_API_BASE_URL}`)
	}
	getExpandQuestions() {
		return axios.get(`http://localhost:8000/question?expand`)
	}
	getQuestionById(id) {
		return axios.get(`${QUESTION_API_BASE_URL}/${id}`)
	}
	postQuestion(item) {
		return axios.post(`${QUESTION_API_BASE_URL}`, item)
	}
	putQuestion(id, item) {
		return axios.put(`${QUESTION_API_BASE_URL}/${id}`, item)
	}
	deleteQuestion(id) {
		return axios.delete(`${QUESTION_API_BASE_URL}/${id}`)
	}
}

export default new QuestionService();
