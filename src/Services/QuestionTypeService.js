import axios from "axios";
import {BASE_URL} from "../utils";

const QUESTION_TYPE_URL = BASE_URL + 'q_type'

class QuestionTypeService{
	get_question_types() {
		return axios.get(`${QUESTION_TYPE_URL}`)
	}
	get_question_type_by_id(id) {
		return axios.get(`${QUESTION_TYPE_URL}/${id}`)
	}
	post_question_type(item) {
		return axios.post(`${QUESTION_TYPE_URL}`, item)
	}
	put_question_type(id, item) {
		return axios.put(`${QUESTION_TYPE_URL}/${id}`, item)
	}
	delete_question_type(id) {
		return axios.delete(`${QUESTION_TYPE_URL}/${id}`)
	}
}

export default new QuestionTypeService();
