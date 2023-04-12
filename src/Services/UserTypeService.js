import axios from "axios";


const USER_TYPE_API_BASE_URL = 'http://localhost:8000/user_type'

class UserTypeService{
	get_user_list() {
		return axios.get(`${USER_TYPE_API_BASE_URL}`)
	}
	get_user_by_id(id) {
		return axios.get(`${USER_TYPE_API_BASE_URL}/${id}`)
	}
	post_user_type(item) {
		return axios.post(`${USER_TYPE_API_BASE_URL}`, item)
	}
	put_user_type(id, item) {
		return axios.put(`${USER_TYPE_API_BASE_URL}/${id}`, item)
	}
	delete_user_type(id) {
		return axios.delete(`${USER_TYPE_API_BASE_URL}/${id}`)
	}
}

export default new UserTypeService();
