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
					<v-toolbar-title id="current-user-name" class="user-title"
													 v-if="currentUser.user_type !== ('noname')">{{currentUser.user_name}}</v-toolbar-title>
				</li>
				<li>
<!--					<b-button @click="logout" v-if="currentUser.user_type !== ('noname')" variant="danger" size="md" class="mb-2">-->
<!--						<b-icon icon="box-arrow-right" aria-hidden="true"></b-icon>-->
<!--						Выйти-->
<!--					</b-button>-->
<!--					<b-button @click="$router.push({name: 'login'})" v-if="currentUser.user_type === 'noname'" variant="outline-primary" size="md" class="mb-2">-->
<!--						<b-icon icon="person-square" aria-hidden="true"></b-icon>-->
<!--						Авторизоваться-->
<!--					</b-button>-->
					<div class="button1 logout" v-if="currentUser.user_type > 0">
						<div class="button1-content logout" @click="logout" >Выйти</div>
					</div>
					<div class="button1 login" id="btn-login" @click="$router.push({name: 'login'})" v-else>
						<div class="button1-content login" >Войти</div>
					</div>
				</li>
			</ul>

		</v-app-bar>
		<v-app-bar
			color="#E6EEFF"
			flat
			height="50px"
			tile>
			<div>
				<a class="btn btn--doar btn-home" id="home-page-btn" @click="$router.push({name: 'home'})">Главная страница</a>
			</div>
			<div>
				<a class="btn btn--doar btn-doar" id="test-list-btn" @click="$router.push({name: 'tests_list'})"
					 v-if="currentUser.level < 2">Список тестов</a>
			</div>
			<div>
				<a class="btn btn--doar btn-admin" id="admin-menu-btn" style=""
					 v-if="currentUser.level === 0" @click="$router.push({name: 'admin_panel'})">Панель администрирования</a>
			</div>
			<v-spacer></v-spacer>
			<div>
				<a class="btn btn--doar btn-results"
					 v-if="currentUser.level >= 0" @click="show_results_modal">Результаты пройденных тестов</a>
			</div>
			<!--			<b-button @click="$router.push({name: 'tests_list'})" pill v-if="currentUser.level < 2">Список тестов</b-button>-->
			<!--			<b-button pill v-if="currentUser.level === 0" @click="$router.push({name: 'admin_panel'})">Панель администрирования</b-button>-->
		</v-app-bar>
		<div class="current-user-results-modal">
			<b-modal
				id="current-user-results-modal"
				ref="current-user-results-modal"
				no-fade
				size="lg"
				scrollable
				title="Результаты"
			>
				<template #modal-header="{ close }">
					<b>Результаты прохождения тестов</b>
				</template>
				<template #default>
					<b-card>
						<b-table :items="testing_system_list"
										 :fields="result_fields" striped responsive="sm" outlined>
							<template #cell(TestName)="row">
								{{tests_list.find(item => item.test_id === row.item.ts_test_id).test_name}}
							</template>
							<template #cell(Date)="row">
								{{getFormatDate(row.item.ts_end_time)}}
							</template>
							<template #cell(ts_score_percent)="row">
								<span>{{row.item.ts_score_percent}}%</span>
							</template>
						</b-table>
					</b-card>
				</template>
				<template #modal-footer="{ cancel, ok, hide }">
					<!-- Кнопка с пользовательским значением триггера закрытия -->
					<b-button size="sm" variant="outline-danger" @click="cancel">
						Закрыть
					</b-button>

				</template>
			</b-modal>
		</div>
	</div>
</template>

<script>
import {authenticationService} from "../authentication.service";

export default {
	name: "AppBar",
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
			show_alert: false,
			result_fields: ['ts_test_id', 'TestName', 'Date', 'ts_score_percent'],
		};
	},
	methods: {
		show_results_modal() {
			this.$bvModal.show('current-user-results-modal')
		},
		logout() {
			authenticationService.logout();
			this.$router.push("/login");
		},
		getFormatDate(date) {
			return new Date(date).toLocaleDateString('ru-RU');
		},
	},
	computed: {
		testing_system_list() {
			if (this.currentUser) {
				return this.$store.state.testingSystems.filter(item => item.ts_user_id === this.currentUser.user_id)
			}
		},
		tests_list() {
			return this.$store.state.tests
		}
	}
}

</script>

<style scoped>

.title1 {
	margin: 1em 0 0.5em 0;
	font-weight: 100;
	text-transform: uppercase;
	color: #d3e7c1;
	font-style: italic;
	font-family: 'Josefin Sans', sans-serif;
	font-size: 58px;
	line-height: 54px;
	text-shadow: 2px 5px 0 rgba(0,0,0,0.2);
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
.btn {
	/*padding: 15px;*/
	font-weight: 700;
	font-size: 15px;
	text-decoration: none;
	text-align: center;
	transition: all .5s ease;
}

.btn--doar {
	color: #fff;
	padding-right: 0;
	background-color: #c0392b;
	-webkit-clip-path: polygon(0% 0%, 100% 0, 100% 80%, 90% 100%, 0% 100%);
	clip-path: polygon(0 0, 100% 0, 100% 60%, 85% 100%, 0 100%);

}

.btn--doar:hover {
	-webkit-clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
	clip-path: polygon(0 0, 100% 0, 100% 100%, 100% 100%, 0 100%);
}

.btn-doar:after {
	content: "\f03a";
	font-family: FontAwesome;
	color: #e74c3c;
	display: inline-block;
	position: relative;
	right: -55px;
	transition: all 0.2s ease;
}
.btn-admin:after {
	content: "\f4fe";
	font-family: FontAwesome;
	color: #e74c3c;
	display: inline-block;
	position: relative;
	right: -55px;
	transition: all 0.2s ease;
}
.btn-home:after {
	content: "\f015";
	font-family: FontAwesome;
	color: #e74c3c;
	display: inline-block;
	position: relative;
	right: -55px;
	transition: all 0.2s ease;
}
.btn-results:after {
	content: "\f00c";
	font-family: FontAwesome;
	color: #e74c3c;
	display: inline-block;
	position: relative;
	right: -55px;
	transition: all 0.2s ease;
}

.btn--doar:hover:after {
	margin: -5px 15px;
	right: 0px;
}

.button1 {
	display:block;
	width:50px;
	height:50px;
	background: rgba(200, 100, 100, 1);
	border-radius:25px;
	border:2px solid rgba(200, 100, 100, 1);
	transition: all .5s;
	overflow:hidden;
}

.button1:hover {
	display:block;
	width:150px;
	height:50px;
	background: rgba(200, 100, 100, 1);
	border-radius:13px;
	border:2px solid rgba(200, 100, 100, 1);
	cursor:pointer;
	transition: all .5s;
	overflow:hidden;
}

.button1-content {
	font-family:Helvetica;
	font-size:25px;
	font-weight:normal;
	line-height:50px;
	color: rgba(255, 255, 255, 1);
	width:150px;
	position: relative;
	transition: all 1s;
	left:150px;
	height:55px;
}

.button1-content:before {
	content: "\f2f5";
	font-family: FontAwesome;
	font-size: 25px;
	padding-left: 10px;
	position: absolute;
	right: 250px;
	background-color: rgba(255, 255, 255, 1);
	width:50px;
	height:50px;
	border-radius:25px;
	color: rgba(200, 100, 100, 1);
}
.button1-content.login:before {
	content: "\f2f6";
	font-family: FontAwesome;
	font-size: 25px;
	padding-left: 10px;
	position: absolute;
	right: 250px;
	background-color: rgba(255, 255, 255, 1);
	width:50px;
	height:50px;
	border-radius:25px;
	color: rgba(200, 100, 100, 1);
}

.button1:hover .button1-content {
	font-family:Helvetica;
	font-size:25px;
	font-weight:normal;
	padding-left: 25%;
	line-height:50px;
	color: rgba(255, 255, 255, 1);
	width:150px;
	transition: all 1s;
	left:0px;
	background-color: rgba(200, 100, 100, 1);
	height:50px;
	border-radius:8px;
}

</style>
