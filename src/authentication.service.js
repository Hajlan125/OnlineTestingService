import {BehaviorSubject} from 'rxjs';
import {handleResponse} from "./utils";

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
	login,
	logout,
	currentUser: currentUserSubject.asObservable(),
	get currentUserValue () { return currentUserSubject.value }
};

function login(user, username, password) {

	const item = user
	localStorage.setItem('currentUser', JSON.stringify(item));
	currentUserSubject.next(item);
	return item

}
function logout() {
	localStorage.removeItem('currentUser');
	currentUserSubject.next(null);
}
