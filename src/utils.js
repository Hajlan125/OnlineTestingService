import {authenticationService} from "./authentication.service";

export function wait(delay) {
	return new Promise(function(resolve) {
		setTimeout(resolve, delay);
	});
}
export const Role = {
	Teacher: 1,
	Student: 2,
	Admin: 0
}
export const Test_Types = {
	Standard: 1,
	Tree_test: 2
}
export const Question_Types = {
	Standard: 1,
	Open_answer: 2,
	Comparison: 3
}
export const BASE_URL = "http://localhost:8000/"
export function handleResponse(response) {
	return response.text().then(text => {
		const data = text && JSON.parse(text);
		if (!response.ok) {
			if ([401,403].indexOf(response.status) !== -1) {
				authenticationService.logout();
				location.reload(true);
			}
			const error = (data && data.message) || response.statusText;
			return Promise.reject(error);
		}
		return data;
	});
}
export function shuffle(array) {
	let currentIndex = array.length,  randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex !== 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
}
export function formatDate(date) {
	let DD = date.getDate();
	if (DD < 10)
		DD = '0' + DD;
	let MM = date.getMonth() + 1;
	if (MM < 10)
		MM = '0' + MM;
	let YYYY = date.getFullYear();
	let mm = date.getMinutes();
	if (mm < 10)
		mm = '0' + mm;
	let hh = date.getHours();
	if (hh < 10)
		hh = '0' + hh;
	return `${DD}.${MM}.${YYYY} ${hh}:${mm}`;
}

export function formatInputDate(date) {
	let DD = date.getDate();
	if (DD < 10)
		DD = '0' + DD;
	let MM = date.getMonth() + 1;
	if (MM < 10)
		MM = '0' + MM;
	let YYYY = date.getFullYear();
	return `${YYYY}-${MM}-${DD}`;
}

export function formatInputTime(date) {
	let mm = date.getMinutes();
	if (mm < 10)
		mm = '0' + mm;
	let hh = date.getHours();
	if (hh < 10)
		hh = '0' + hh;
	return `${hh}:${mm}`;
}





