import axios from "axios";


const TEST_TYPE_API_BASE_URL = 'http://localhost:8000/test_type'

class TestTypeService{
	get_test_types() {
		return axios.get(`${TEST_TYPE_API_BASE_URL}`)
	}
	get_test_type_by_id(id) {
		return axios.get(`${TEST_TYPE_API_BASE_URL}/${id}`)
	}
	post_test_type(item) {
		return axios.post(`${TEST_TYPE_API_BASE_URL}`, item)
	}
	put_test_type(id, item) {
		return axios.put(`${TEST_TYPE_API_BASE_URL}/${id}`, item)
	}
	delete_test_type(id) {
		return axios.delete(`${TEST_TYPE_API_BASE_URL}/${id}`)
	}
}

export default new TestTypeService();
