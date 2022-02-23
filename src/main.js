import 'babel-polyfill';
import Vue from 'vue';
import VueTree from '@ssthouse/vue-tree-chart'
import App from "./App";
import router from "./router";
import {store} from "./stores/index";
// import VueModal from "@kouts/vue-modal";
// import VModal from 'vue-js-modal';
// import Modal from "@burhanahmeed/vue-modal-2"
// import Modal from "@melmacaluso/vue-modal"
import Vodal from 'vodal';
import { BootstrapVue, IconsPlugin, ModalPlugin} from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import {vfmPlugin} from 'vue-final-modal'
import axios from "axios";
import {authenticationService} from "./authentication.service";
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
	const {authorize} = to.meta;
	const currentUser = authenticationService.currentUserValue;
	if (authorize) {
		if (!currentUser) {
			return next({path: '/login', query: {returnUrl: to.path}});
		}
		if (authorize.length && !authorize.includes(currentUser.user_type)) {
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
Vue.use(vfmPlugin)
new Vue({
	VueTree,
  router,
  store,
  el: "#app",
  render: h => h("router-view"),
});
