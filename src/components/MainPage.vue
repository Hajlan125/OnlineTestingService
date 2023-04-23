<template>
	<div>

		<appbar></appbar>
		<div class="wrapper-main">
<!--			<div id="formContent">-->
<!--				<ul>-->
<!--					<li><b-icon icon="file-text" style="height: 22px; width: 22px"></b-icon></li>-->
<!--					<li><h3>Найти тест</h3></li>-->
<!--				</ul>-->
<!--				<input v-model="search_test_id" class="text" id="test-id-input">-->
<!--				<b-button @click="noTestDetection(parseInt(search_test_id))" variant="info">-->
<!--					<b-icon icon="search"></b-icon>-->
<!--					Поиск-->
<!--				</b-button>-->
<!--				<b-button @click="show_results_modal">-->
<!--					Результаты-->
<!--				</b-button>-->
<!--			</div>-->
			<div style="padding-top: 100px">
				<div id="cover">
					<div class="tb">
						<div class="td"><input type="text" placeholder="Поиск теста" required v-model="search_test_id"></div>
						<div class="td" id="s-cover">
							<button @click="noTestDetection(parseInt(search_test_id))">
								<div id="s-circle"></div>
								<span></span>
							</button>
						</div>
					</div>
				</div>
				<b-alert
					:show="show_alert"
					dismissible
					variant="warning"
					@dismiss-count-down="5"
					@dismissed="show_alert=false">Тест не найден</b-alert>
			</div>
			</div>


	</div>
</template>

<script>
import { authenticationService } from "../authentication.service";

export default {
	components: {
		// appbar
	},
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
		this.$store.dispatch('initTestingSystem')
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
};
</script>
<style scoped>

.wrapper-main {
	display: flex;
	align-items: center;
	flex-direction: column;
	justify-content: center;
	width: 100%;
	min-height: 100%;
	padding: 20px;
}
 .tb {
	 display: table;
	 width: 100%;
 }

 .td {
	 display: table-cell;
	 vertical-align: middle;
 }

 input,
 button {
	 color: #fff;
	 font-family: Nunito;
	 padding: 0;
	 margin: 0;
	 border: 0;
	 background-color: transparent;
 }

 #cover {
	 position: absolute;
	 top: 50%;
	 left: 0;
	 right: 0;
	 width: 35%;
	 padding: 35px;
	 margin: -83px auto 0 auto;
	 background-color: #c0392b;
	 border-radius: 20px;
	 box-shadow: 0 10px 40px #ff7c7c, 0 0 0 20px #ffffffeb;
	 transform: scale(0.6);
 }

 form {
	 height: 96px;
 }

 input[type="text"] {
	 width: 100%;
	 height: 96px;
	 font-size: 60px;
	 line-height: 1;
 }

 input[type="text"]::placeholder {
	 color:  #fff;
 }

 #s-cover {
	 width: 1px;
	 padding-left: 35px;
 }

 button {
	 position: relative;
	 display: block;
	 width: 84px;
	 height: 96px;
	 cursor: pointer;
 }

 #s-circle {
	 position: relative;
	 top: -8px;
	 left: 0;
	 width: 70px;
	 height: 70px;
	 margin-top: 0;
	 border: 15px solid #fff;
	 background-color: transparent;
	 border-radius: 50%;
	 transition: 0.5s ease all;
 }

 button span {
	 position: absolute;
	 top: 68px;
	 left: 50px;
	 display: block;
	 width: 45px;
	 height: 15px;
	 background-color: transparent;
	 border-radius: 10px;
	 transform: rotateZ(43deg);
	 transition: 0.5s ease all;
 }

 button span:before,
 button span:after {
	 content: "";
	 position: absolute;
	 bottom: 0;
	 right: 0;
	 width: 45px;
	 height: 15px;
	 background-color: #fff;
	 border-radius: 10px;
	 transform: rotateZ(0);
	 transition: 0.5s ease all;
 }

 #s-cover:hover #s-circle {
	 top: -1px;
	 width: 67px;
	 height: 15px;
	 border-width: 0;
	 background-color: #fff;
	 border-radius: 20px;
 }

 #s-cover:hover span {
	 top: 50%;
	 left: 56px;
	 width: 25px;
	 margin-top: -9px;
	 transform: rotateZ(0);
 }

 #s-cover:hover button span:before {
	 bottom: 11px;
	 transform: rotateZ(52deg);
 }

 #s-cover:hover button span:after {
	 bottom: -11px;
	 transform: rotateZ(-52deg);
 }
 #s-cover:hover button span:before,
 #s-cover:hover button span:after {
	 right: -6px;
	 width: 40px;
	 background-color: #fff;
 }

</style>
