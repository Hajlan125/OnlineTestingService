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

import { vfmPlugin } from 'vue-final-modal'
Vue.use(vfmPlugin)

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
	const {authorize} = to.meta;
	const currentUser = authenticationService.currentUserValue;
	if (authorize) {
		if (!currentUser) {
			return next({path: '/login', query: {returnUrl: to.path}});
		}
		if (authorize.length && !authorize.includes(currentUser.user_type) && (currentUser.user_type !== 'admin')) {
			alert("NO PERMISSION")
			return next({path: '/home'});
		}
	}
	next();
})
Vue.component(Vodal.name, Vodal)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(ModalPlugin)

Vue.component('Modal', VueModal)

new Vue({
	VueTree,
	vuetify,
  router,
  store,
  el: "#app",
  render: h => h("router-view"),
});
