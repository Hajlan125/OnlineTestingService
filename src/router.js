import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App';
import TestPage from "./components/TestPage";
import Companies from "./components/TestList";
import Loader from "./Loader";
import QuestionPage from "./components/QuestionPage";
import MainPage from "./components/MainPage";
import Register from "./components/Register";
import LoginPage from "./components/LoginPage";
import TreeTestPage from "./components/TreeTestPage"
import { Role } from "./utils";
import TestCreation from "./components/TestCreation";


Vue.use(VueRouter);
export default new VueRouter({
	mode: 'history',
	routes: [
		{ path: "/", name: "loader", component: Loader },
		{path: "/app", name: "app", component: App},
		{path: "/modal", name: "modal", component: Register},
		{ path: "/tests", name: "tests_list",component: Companies, meta: {authorize: [Role.Admin, Role.Teacher]}},
		{path: "/test/:id", name:"test_page", component: TestPage},
		{path: "/test/:id/question/:q_id", name:"question_by_test", component: QuestionPage},
		{path: "/tree_test/:id", name:"tree_test_page", component: TreeTestPage},
		{path: "/login", name: "login", component:LoginPage},
		{path: "/home", name: "home", component: MainPage},
		{path: "/test_creation", name:"test_creation", component: TestCreation, meta: {authorize: [Role.Teacher, Role.Admin]}}
	],
});

