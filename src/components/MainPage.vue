<template>
	<div>
		<v-app-bar
			color="#42A5F5"
			flat
			height="150px"
			tile
		>
<!--			<v-toolbar-title class="title1"> Система Онлайн Тестирования</v-toolbar-title>-->
			<h1 class="title1">Система Онлайн Тестирования</h1>

			<v-spacer></v-spacer>

			<ul>
				<li>
					<v-toolbar-title class="user-title" v-if="currentUser.user_type !== ('noname')">{{currentUser.user_name}}</v-toolbar-title>
				</li>
				<li>
					<b-button @click="logout" v-if="currentUser.user_type !== ('noname')" variant="danger" size="md" class="mb-2">
						<b-icon icon="box-arrow-right" aria-hidden="true"></b-icon>
						Выйти
					</b-button>
					<b-button @click="$router.push({name: 'login'})" v-if="currentUser.user_type === 'noname'" variant="outline-primary" size="md" class="mb-2">
						<b-icon icon="person-square" aria-hidden="true"></b-icon>
						Авторизоваться
					</b-button>
				</li>
			</ul>

		</v-app-bar>
		<v-app-bar
			color="#E6EEFF"
			flat
			height="50px"
			tile>
			<b-button @click="$router.push({name: 'tests_list'})" pill v-if="currentUser.user_type === ('admin') || currentUser.user_type === ('teacher')">Список тестов</b-button>
			<b-button pill v-if="currentUser.user_type === ('admin')" @click="$router.push({name: 'admin_panel'})">Панель администрирования</b-button>
		</v-app-bar>
		<div class="wrapper-main">
			<div id="formContent">
				<ul>
					<li><b-icon icon="file-text" style="height: 22px; width: 22px"></b-icon></li>
					<li><h3>Найти тест</h3></li>
				</ul>
				<input v-model="search_test_id" class="text" id="test-id-input">
				<b-button @click="noTestDetection(parseInt(search_test_id))" variant="info">
					<b-icon icon="search"></b-icon>
					Поиск
				</b-button>
			</div>
			<b-alert
				:show="show_alert"
				dismissible
				variant="warning"
				@dismiss-count-down="5"
				@dismissed="show_alert=false">Тест не найден</b-alert>
		</div>
	</div>
</template>

<script>
import { authenticationService } from "../authentication.service";

export default {
	created() {
		if (localStorage.getItem('currentUser')) {
			try {
				this.currentUser = JSON.parse(localStorage.getItem('currentUser'))
			} catch (e) {
				alert(e)
			}
		} else {
			this.currentUser = {
				user_type: 'noname'
			}
		}
		this.$store.dispatch('initUsers')
		this.$store.dispatch('initTest')
	},
	data () {
		return {
			currentUser: null,
			userFromApi: "",
			user: "",
			search_test_id: null,
			show_alert: false
		};
	},
	methods: {
		alerts() {
			alert("assad")
		},
		logout() {
			authenticationService.logout();
			this.$router.push("/login");
		},
		noTestDetection(id) {
			// await this.$store.dispatch('initCurrentTest', id)
			// if (this.$store.state.alertText === 'ERROR') {
			// 	alert('Тест не существует')
			// 	await this.$store.dispatch('removeAlertText')
			// } else {
			// 	await this.$store.dispatch('removeAlertText')
			// 	await this.$router.push({name: 'test_view', params: {id: id}})
			// }
			if (this.$store.state.tests.find(item => item.test_id === id)) {
				this.$router.push({name: 'test_view', params: {id: id}})
			} else {
				this.show_alert = true
			}
		}
	}
};
</script>
<style scoped>
 .title1 {
	 font-size: 50px;
	 font-weight: bold;
	 color: #FFFFFF;
	 text-shadow:
		 -0 -3px 5px #000000,
		 0 -3px 5px #000000,
		 -0 3px 5px #000000,
		 0 3px 5px #000000,
		 -3px -0 5px #000000,
		 3px -0 5px #000000,
		 -3px 0 5px #000000,
		 3px 0 5px #000000,
		 -1px -3px 5px #000000,
		 1px -3px 5px #000000,
		 -1px 3px 5px #000000,
		 1px 3px 5px #000000,
		 -3px -1px 5px #000000,
		 3px -1px 5px #000000,
		 -3px 1px 5px #000000,
		 3px 1px 5px #000000,
		 -2px -3px 5px #000000,
		 2px -3px 5px #000000,
		 -2px 3px 5px #000000,
		 2px 3px 5px #000000,
		 -3px -2px 5px #000000,
		 3px -2px 5px #000000,
		 -3px 2px 5px #000000,
		 3px 2px 5px #000000,
		 -3px -3px 5px #000000,
		 3px -3px 5px #000000,
		 -3px 3px 5px #000000,
		 3px 3px 5px #000000,
		 -3px -3px 5px #000000,
		 3px -3px 5px #000000,
		 -3px 3px 5px #000000,
		 3px 3px 5px #000000;
 }
 li {
	 list-style-type: none;
	 display: inline-flex;
	 padding: 5px;
	 margin: 5px;
 }
 .user-title {
	 font-family: Arial, Helvetica, sans-serif;
	 font-size: 25px;
	 letter-spacing: -0.6px;
	 word-spacing: -0.4px;
	 color: #FFFFFF;
	 color: #FFFFFF;
	 text-shadow:
		 2px 2px 2px #000000;
	 font-weight: 400;
	 text-decoration: overline;
	 font-style: normal;
	 font-variant: normal;
	 text-transform: capitalize;
 }
 .user-icon {
	 width: 40px !important;
	 height: 40px !important;
 }
 .wrapper-main {
	 display: flex;
	 align-items: center;
	 flex-direction: column;
	 justify-content: center;
	 width: 100%;
	 min-height: 100%;
	 padding: 20px;
 }

 #formContent {
	 -webkit-border-radius: 10px 10px 10px 10px;
	 border-radius: 10px 10px 10px 10px;
	 background: #fff;
	 padding: 30px;
	 width: 90%;
	 max-width: 450px;
	 position: relative;
	 padding: 0px;
	 -webkit-box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
	 box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
	 text-align: center;
 }
 #test-id-input {
	 -webkit-border-radius: 10px 10px 10px 10px;
	 border-radius: 10px 10px 10px 10px;
	 -webkit-box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
	 box-shadow: 0 30px 60px 0 rgba(0,0,0,0.3);
	 text-align: center;
	 justify-content: center;
 }

</style>
