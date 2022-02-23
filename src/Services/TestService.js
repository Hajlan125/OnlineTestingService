import axios from "axios";


const TEST_API_BASE_URL = 'http://localhost:8000/test'

class TestService {
	getTests() {
		return axios.get(`${TEST_API_BASE_URL}`)
	}
	getTestById(id) {
		return axios.get(`${TEST_API_BASE_URL}/${id}`)
	}
	postTest(item) {
		return axios.post(`${TEST_API_BASE_URL}`, item)
	}
	putTest(id, item) {
		return axios.put(`${TEST_API_BASE_URL}/${id}`, item)
	}
	deleteTest(id) {
		return axios.delete(`${TEST_API_BASE_URL}/${id}`)
	}
}

export default new TestService();
