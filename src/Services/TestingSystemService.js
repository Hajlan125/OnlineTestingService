import axios from "axios";
import {BASE_URL} from "../utils";

const TESTING_SYSTEM_API_BASE_URL = BASE_URL + 'testing_system'

class TestingSystemService{
	getTestingSystem() {
		return axios.get(`${TESTING_SYSTEM_API_BASE_URL}`)
	}
	getTestingSystemById(id) {
		return axios.get(`${TESTING_SYSTEM_API_BASE_URL}/${id}`)
	}
	postTestingSystem(item) {
		return axios.post(`${TESTING_SYSTEM_API_BASE_URL}`, item)
	}
	putTestingSystem(id, item) {
		return axios.put(`${TESTING_SYSTEM_API_BASE_URL}/${id}`, item)
	}
	deleteTestingSystem(id) {
		return axios.delete(`${TESTING_SYSTEM_API_BASE_URL}/${id}`)
	}
}

export default new TestingSystemService();
