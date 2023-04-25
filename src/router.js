import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import TestPage from "./components/TestPage";
import TestList from "./components/TestList";
import Loader from "./Loader";
import QuestionPage from "./components/QuestionPage";
import MainPage from "./components/MainPage";
import Register from "./components/Register";
import LoginPage from "./components/LoginPage";
import TreeTestPage from "./components/TreeTestPage"
import { Role } from "./utils";
import TestCreation from "./components/TestCreation";
import TestView from "./components/TestView";
import TestPassing from "./components/TestPassing";
import AdminPanel from "./components/AdminPanel";


Vue.use(VueRouter);
export default new VueRouter({
	mode: 'history',
	routes: [
		{path: "/", name: "loader", component: Loader },
		{path: "/app", name: "app", component: App},
		{path: "/tests", name: "tests_list",component: TestList,
											meta: {level: 1}},
		{path: "/test/:id", name:"test_page", component: TestPage},
		{path: "/test/:id/question/:q_id", name:"question_by_test", component: QuestionPage},
		{path: "/tree_test/:id", name:"tree_test_page", component: TreeTestPage},
		{path: "/login", name: "login", component:LoginPage},
		{path: "/home", name: "home", component: MainPage},
		{path: "/test_view/:id", name:"test_view", component: TestView},
		{path: "/passing/:id", name:"test_passing", component: TestPassing,
														meta: {level: 99}},
		{path: "/administration", name:"admin_panel", component: AdminPanel,
															meta: {level: 0},}
	],
});

