import 'babel-polyfill';
import Vue from 'vue';
import VueTree from '@ssthouse/vue-tree-chart';
import App from "./App";
import router from "./router";
import {store} from "./stores/index";
import VueModal from "@kouts/vue-modal";
import '@kouts/vue-modal/dist/vue-modal.css';
// import VModal from 'vue-js-modal';
// import Modal from "@burhanahmeed/vue-modal-2"
// import Modal from "@melmacaluso/vue-modal"
import Vodal from 'vodal';
import { BootstrapVue, IconsPlugin, ModalPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import {authenticationService} from "./authentication.service";
import vuetify from './vuetify'
import AppBar from './components/AppBar'
import { vfmPlugin } from 'vue-final-modal'
import axios from "axios";
import VueHtml2pdf from "vue-html2pdf";
import {BASE_URL} from "./utils";
Vue.use(vfmPlugin)

Vue.config.productionTip = false

router.beforeEach(async (to, from, next) => {
	const {authorize, level} = to.meta;
	const currentUser = authenticationService.currentUserValue;
	if (level !== undefined) {
		if (!currentUser) {
			alert('Необходимо авторизоваться')
			return next({path: '/login', query: {returnUrl: to.path}});
		}

		// let response = await axios.get(`http://localhost:8000/user_type/${currentUser.user_type}`)
		// let user_level = response['data']["access_level"]
		//
		// if (authorize.length && user_level > level
		// 	&& (currentUser.user_type !== 1)) {
		// 	alert("Нет доступа")
		// 	return next({path: '/home'});
		// }
		let user_id = currentUser.user_id
		const response = await (axios.get(`${BASE_URL}perm_checker?req=${level}&u_id=${user_id}`))

		if (response.status === 403) {
			alert('Нет доступа')
			return next({path: 'home'})
		} else if (response.status === 404) {
			alert('Ошибка')
			return next({path: 'home'})
		}
	}
	next();
})

Vue.component(Vodal.name, Vodal)

Vue.use(ModalPlugin)
Vue.component('Modal', VueModal)
Vue.component('appbar', AppBar)
Vue.component('vue-tree', VueTree)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueHtml2pdf)
new Vue({
	VueTree,
	vuetify,
  router,
  store,
  el: "#app",
  render: h => h("router-view"),
});
