import {authenticationService} from "./authentication.service";

export function wait(delay) {
	return new Promise(function(resolve) {
		setTimeout(resolve, delay);
	});
}
export function redirecting(link, store, router) {
	switch (link){
		case 'subject':
			store.dispatch('initialize');
			store.dispatch('initSubjects');
			router.push({name:'subjects_list'});
			break;
		case 'user':
			store.dispatch('initUsers');
			router.push({name:'users_list'});
			break;
		case 'company':
			store.dispatch('initialize');
			router.push({name:'companies_list'});
			break;
		case 'feedback':
			store.dispatch('initFeedbacks');
			store.dispatch('initUsers');
			store.dispatch('initSubjects');
			router.push({name:'feedbacks_list'});
			break;
		default:
			router.go();
			break
	}
}
export const Role = {
	Teacher: 'teacher',
	Student: 'student',
	Admin: 'admin'
}
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

