import axios from "axios";


const USER_API_BASE_URL = 'http://localhost:8000/user'

class UserService{
	getUsers() {
		return axios.get(`${USER_API_BASE_URL}`)
	}
	getUserById(id) {
		return axios.get(`${USER_API_BASE_URL}/${id}`)
	}
	postUser(item) {
		return axios.post(`${USER_API_BASE_URL}`, item)
	}
	putUser(id, item) {
		return axios.put(`${USER_API_BASE_URL}/${id}`, item)
	}
	deleteUser(id) {
		return axios.delete(`${USER_API_BASE_URL}/${id}`)
	}
}

export default new UserService();
