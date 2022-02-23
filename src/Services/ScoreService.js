import axios from "axios";

const SCORE_API_BASE_URL = 'http://localhost:8000/score'

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
