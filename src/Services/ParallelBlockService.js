import axios from "axios";
import {BASE_URL} from "../utils";

const PARALLEL_BLOCK_URL = BASE_URL + 'p_block'

class ParallelBlockService{
	get_parallel_blocks() {
		return axios.get(`${PARALLEL_BLOCK_URL}`)
	}
	get_parallel_block_by_id(id) {
		return axios.get(`${PARALLEL_BLOCK_URL}/${id}`)
	}
	post_parallel_block(item) {
		return axios.post(`${PARALLEL_BLOCK_URL}`, item)
	}
	put_parallel_block(id, item) {
		return axios.put(`${PARALLEL_BLOCK_URL}/${id}`, item)
	}
	delete_parallel_block(id) {
		return axios.delete(`${PARALLEL_BLOCK_URL}/${id}`)
	}
}

export default new ParallelBlockService();
