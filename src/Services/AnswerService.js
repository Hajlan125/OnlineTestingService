import axios from "axios";
import {BASE_URL} from "../utils";

const ANSWER_API_BASE_URL = BASE_URL + 'answer'

class AnswerService{
	getAnswers() {
		return axios.get(`${ANSWER_API_BASE_URL}`)
	}
	getAnswerById(id) {
		return axios.get(`${ANSWER_API_BASE_URL}/${id}`)
	}
	postAnswer(item) {
		return axios.post(`${ANSWER_API_BASE_URL}`, item)
	}
	putAnswer(id, item) {
		return axios.put(`${ANSWER_API_BASE_URL}/${id}`, item)
	}
	deleteAnswer(id) {
		return axios.delete(`${ANSWER_API_BASE_URL}/${id}`)
	}
}

export default new AnswerService();
