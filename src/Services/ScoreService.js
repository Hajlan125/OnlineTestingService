import axios from "axios";
import {BASE_URL} from "../utils";

const SCORE_API_BASE_URL = BASE_URL + 'score'

class ScoreService{
	getScores() {
		return axios.get(`${SCORE_API_BASE_URL}`)
	}
	getScoreById(id) {
		return axios.get(`${SCORE_API_BASE_URL}/${id}`)
	}
	postScore(item) {
		return axios.post(`${SCORE_API_BASE_URL}`, item)
	}
	putScore(id, item) {
		return axios.put(`${SCORE_API_BASE_URL}/${id}`, item)
	}
	deleteScore(id) {
		return axios.delete(`${SCORE_API_BASE_URL}/${id}`)
	}
}

export default new ScoreService();
