<template>
	<div>
		<v-app-bar
			color="#42A5F5"
			flat
			height="150px"
			tile
		>
			<h1 class="title1">Система Онлайн Тестирования</h1>
			<v-spacer></v-spacer>
			<ul>
				<li>
					<v-toolbar-title class="user-title">{{currentUser.user_name}}</v-toolbar-title>
				</li>
				<li>
					<b-button @click="logout" variant="danger" size="md" class="mb-2">
						<b-icon icon="box-arrow-right" aria-hidden="true"></b-icon>
						Выйти
					</b-button>
				</li>
			</ul>

		</v-app-bar>
		<v-app-bar
			color="#E6EEFF"
			flat
			height="50px"
			tile>
			<b-button @click="$router.push({name: 'home'})" pill>Вернуться в главное меню</b-button>
		</v-app-bar>
		<div>
			<b-tabs pills card style="width: 95%; margin-left: auto; margin-right: auto;" content-class="mt-3">
				<b-tab title="Список пользователей">
					<b-button @click="showChangingPasswordModal(currentUser.user_id)" variant="primary">Изменить собственный пароль</b-button>
					<b-card>
						<b-button class="button-71" @click="showUserModal(0)">Добавить</b-button>
						<b-table fixed :items="userList" :fields="fields">
							<template #cell(password)="data">
								<b-button @click="showChangingPasswordModal(data.item.user_id)" variant="outline-primary">
									Изменить пароль
								</b-button>
							</template>
							<template #cell(edit)="data">
								<b-button @click="showUserModal(data.item.user_id)" variant="outline-warning">
									<b-icon icon="pencil-square"></b-icon>
									Изменить
								</b-button>
							</template>
							<template #cell(delete)="data">
								<b-button @click="showMsgOk($event,data.item.user_id)" variant="outline-danger">
									<b-icon icon="trash"></b-icon>
									Удалить
								</b-button>
							</template>
						</b-table>
					</b-card>
				</b-tab>
				<b-tab v-on:click.once="load_user_types" title="Типы пользователей">
					<b-skeleton-wrapper :loading="loading">
						<template #loading>
							<b-card>
								<b-skeleton width="85%"></b-skeleton>
								<b-skeleton width="55%"></b-skeleton>
								<b-skeleton width="70%"></b-skeleton>
							</b-card>
						</template>
						<b-card>
							<b-button class="button-71" @click="show_user_type_edit_modal(0)">Добавить</b-button>
							<b-table :items="user_type_list" :fields="user_types_fields">
								<template #cell(edit)="data">
									<b-button @click="show_user_type_edit_modal(data.item.type_u_id)" variant="outline-warning">
										<b-icon icon="pencil-square"></b-icon>
										Изменить
									</b-button>
								</template>
								<template #cell(delete)="data">
									<b-button v-if="data.item.type_u_id > 2" @click="alert('delete type')">
										Удалить
									</b-button>
									<p1 v-else>
										Удаление запрещено
									</p1>
								</template>
							</b-table>
						</b-card>
					</b-skeleton-wrapper>
				</b-tab>
			</b-tabs>
		</div>
		<div>
			<b-modal id="type-modal" no-fade title="Изменение типа пользователя">
				<template #default>
					<label for="type-input">Тип пользователя</label>
					<b-form-input id="type-input" v-model="user_type_item.type_user"></b-form-input>
					<label for="type-access-level-input">Уровень доступа</label>
					<b-form-input id="type-access-level-input" v-model="user_type_item.access_level" type="number"></b-form-input>
				</template>
				<template #modal-footer="{ok, cancel}">
					<div class="text-left">
						<b-button @click="submit_user_type($event)" variant="success">OK</b-button>
						<b-button @click="cancel" variant="danger">Отмена</b-button>
					</div>
				</template>
			</b-modal>
		</div>
		<div>
			<b-modal id="user-modal" cancel-title="Отмена" cancel-variant="secondary"
							  no-fade title="Редактирование пользователя">
				<template #default>
					<b-form id="user-form" @submit="submitUser($event)">
						<b-form-group label="ФИО пользователя" label-for="user-name-input">
							<b-form-input required id="user-name-input" v-model="user_item.user_name" placeholder="Введите ФИО пользователя"></b-form-input>
						</b-form-group>
						<b-form-group label="Тип" label-for="user-type-input">
							<b-form-select required id="user-type-input" v-model="user_item.user_type" :options=user_type_options value-field="type_u_id" text-field="type_user"></b-form-select>
						</b-form-group>
						<b-form-group v-if="user_item.user_id === 0" label="Логин" label-for="user-login-input">
							<b-form-input required id="user-login-input" v-model="user_item.login" placeholder="Введите логин"></b-form-input>
							<b-button class="generator-btn" @click="generate_login">Сгенерировать логин</b-button>
						</b-form-group>
						<b-alert dismissible @dismiss-count-down="10"
										 @dismissed="alert_show=false" variant="warning"
										 :show="alert_show">Данный логин уже занят</b-alert>
						<b-form-group v-if="user_item.user_id === 0" label="Пароль" label-for="user-password-input">
							<b-form-input required id="user-password-input" v-model="user_item.password" placeholder="Введите пароль"></b-form-input>
							<b-button class="generator-btn" @click="generate_password">Сгенерировать пароль</b-button>
						</b-form-group>
					</b-form>
				</template>
				<template #modal-footer="{ cancel }">
					<b-btn @click="cancel">Отмена</b-btn>
					<b-btn variant="success" type="submit" form="user-form">OK</b-btn>
				</template>
			</b-modal>
		</div>
		<div>
			<b-modal id="password-change-modal" cancel-title="Отмена"
							 cancel-variant="secondary" ok-variant="success" @cancel="new_password=''"
							 no-fade title="Редактирование пароля">
				<template #default>
					<b-form id="new-password-form" @submit="submitNewPassword($event, user_item.user_id)">
						<b-form-group label="Новый пароль" label-for="user-name-input">
							<b-form-input required id="new-password-input" v-model="new_password"
														placeholder="Введите новый пароль"></b-form-input>
							<b-button class="generator-btn" @click="generate_password">Сгенерировать пароль</b-button>
						</b-form-group>
					</b-form>
				</template>
				<template #modal-footer="{ cancel }">
					<b-btn @click="cancel">Отмена</b-btn>
					<b-btn variant="success" @click="submitNewPassword($event, user_item.user_id)">OK</b-btn>
				</template>
			</b-modal>
		</div>
	</div>
</template>

<script>
import {authenticationService} from "../authentication.service";
import {wait} from "../utils";
import generatePassword from "password-generator";

import bcrypt from "bcryptjs";

export default {
	name: "AdminPanel",
	created() {
		this.$store.dispatch('initUsers')
		this.$store.dispatch('initUserTypes')
	},
	mounted() {
		this.$store.dispatch('initUsers')
		this.$store.dispatch('initUserTypes')
		this.user_type_options = [...[{'type_u_id': null, 'type_user': 'Выберите тип'}], ...this.user_type_list]
	},
	data() {
		return {
			selected: [],
			loading: true,
			password_hide: true,
			fields: ['user_id', 'user_name', 'user_type', 'login', 'password', 'edit', 'delete'],
			user_types_fields: ['type_u_id', 'type_user', 'access_level', 'edit', 'delete'],
			currentUser: authenticationService.currentUserValue,
			options: [
				{ value: null, text: 'Пожалуйста, выберите тип' },
				{ value: 1, text: 'Администратор' },
				{ value: 'teacher', text: 'Преподаватель'},
				{ value: 'student', text: 'Студент' },
			],
			user_type_options: [],
			name: "",
			user_item: {
				user_id: 0,
				user_name: "",
				user_type: 0,
				login: "",
				password: ""
			},
			user_type_item: {
				type_u_id: 0,
				type_user: "",
				access_level: 99
			},
			is_new: true,
			is_new_type: true,
			new_password: "",
			alert_show: false
		}
	},
	methods: {
		async showMsgOk(e, id) {
			this.$bvModal.msgBoxConfirm('Вы уверены, что хотите удалить пользователя?', {
				title: 'Пожалуйста, подтвердите',
				noFade: true,
				size: 'sm',
				buttonSize: 'sm',
				okVariant: 'danger',
				okTitle: 'YES',
				cancelTitle: 'NO',
				cancelVariant: 'secondary',
				footerClass: 'p-2',
				hideHeaderClose: false,
				centered: true
			})
				.then(value => {
					if (value) {
						this.handleRemoveUser(e, id)
					}
				})
				.catch(err => {
					// An error occurred
				})
		},
		async handleRemoveUser(e, id) {
			e.preventDefault()
			await this.$store.dispatch('removeUserItem', id)
			await this.$store.dispatch('initUsers')
		},

		showUserModal(user_id) {
			if (user_id === 0) {
				this.user_item= {
					user_id: 0,
					user_name: "",
					user_type: 98,
					login: "",
					password: "",
				}
				this.is_new = true
			} else {
				const item = this.userList.find(item => item.user_id === user_id)
				this.user_item= {
					user_id: item.user_id,
					user_name: item.user_name,
					user_type: item.user_type,
					login: item.login,
					password: item.password,
				}
				this.is_new = false
			}
			this.$bvModal.show('user-modal')
		},
		async submitUser(e) {
			e.preventDefault()
			if (this.user_item.user_id === 0) {
				if (this.$store.state.users.find(item => item.login === this.user_item.login)) {
					this.alert_show = true
				} else {
					this.user_item.password = bcrypt.hashSync(this.user_item.password, 10)
					alert(this.user_item.user_type)
					await this.$store.dispatch('addUserItem', this.user_item)
					this.$bvModal.hide('user-modal')
					this.alert_show = false
				}
			} else {
				await this.$store.dispatch('editUserItem', this.user_item)
			}

		},

		show_user_type_edit_modal(type_id) {
			if (type_id === 0) {
				this.user_type_item = {
					type_u_id: 0,
					type_user: "",
					access_level: 99
				}
				this.is_new_type = true
			} else {
				const item = this.user_type_list.find(item => item.type_u_id === type_id)
				this.user_type_item = {
					type_u_id: item.type_u_id,
					type_user: item.type_user,
					access_level: item.access_level
				}
				this.is_new_type = false
			}
			this.$bvModal.show('type-modal')
		},

		async submit_user_type(e) {
			e.preventDefault()
			alert(JSON.stringify(this.user_type_item))
			if (this.user_type_item.type_u_id === 0) {
				await this.$store.dispatch('add_user_type_item', this.user_type_item)
			} else {
				await this.$store.dispatch('edit_user_type_item', this.user_type_item)
			}
			await this.$store.dispatch('initUserTypes')
			this.$bvModal.hide('type-modal')
		},

		showChangingPasswordModal(user_id) {
			const item = this.userList.find(item => item.user_id === user_id)
			if (item) {
				this.user_item= {
					user_id: item.user_id,
					user_name: item.user_name,
					user_type: item.user_type,
					login: item.login,
					password: item.password,
				}
			} else {
				this.user_item= {
					user_id: this.currentUser.user_id,
					user_name: this.currentUser.user_name,
					user_type: this.currentUser.user_type,
					login: this.currentUser.login,
					password: this.currentUser.password,
				}
			}
			this.$bvModal.show('password-change-modal')
		},
		async submitNewPassword(e, user_id) {
			e.preventDefault()
			let item = {
				user_id: user_id,
				password: bcrypt.hashSync(this.new_password, 10)
			}
			await this.$store.dispatch('editUserItem', item)
			this.$bvModal.hide('password-change-modal')
		},

		load_user_types() {
			this.$nextTick(async () => {
				this.loading = true;
				await this.$store.dispatch('initUserTypes')
				// await this.$store.dispatch('initScore')
				await wait(500);
				this.loading = false;
			});
		},
		logout() {
			authenticationService.logout()
			this.$router.push({name: 'login'})
		},
		alert(smth) {
			alert(smth)
		},
		replaceChars(string) {
			let str = ""
			for(let i =0; i<string.length; i++){
				str += "*"
			}
			return str
		},

		generate_password() {
			let password = generatePassword(4)
			let charset = '123456789'
			let rand = Math.random() * (5 - 2) + 2;
			for(let i=0; i<=rand; i++) {
				let randIndex = (Math.floor(Math.random() * charset.length-1)+1).toString();
				let randomChar = charset[randIndex];
				let pos = Math.floor(Math.random() * (password.length + 1));
				password = password.substr(0, pos) + randomChar + password.substr(pos);
			}
			this.user_item.password = password
			this.new_password = password
		},
		generate_login() {
			let syllable_1 = ["Abing", "Al", "Ald", "Aln", "Ames", "Amp", "Ash", "At", "Ave", "Aving", "Ax", "Back", "Bake", "Bamp", "Ban", "Beck", "Ber", "Berke", "Bevers", "Bi", "Bick", "Bin", "Block", "Bol", "Bos", "Bottes", "Bow", "Brad", "Brans", "Brat", "Bre", "Bree", "Bridg", "Brink", "Bris", "Brom", "Broom", "Bud", "Cad", "Caer", "Came", "Car", "Cart", "Castle", "Cavers", "Charter", "Ched", "Chew", "Chippen", "Coly", "Corn", "Cors", "Cran", "Credi", "Crick", "Crow", "Culm", "Dagger", "Dart", "Dedding", "Deer", "Din", "Ditte", "Dittis", "Dor", "Dragon", "Drif", "Dry", "Dun", "Dur", "Dwarf", "East", "Ebring", "Eding", "Elf", "Elk", "En", "Erming", "Exe", "Fair", "Faring", "Flad", "Fording", "Forth", "Framp", "From", "Gis", "Glas", "Gnome", "Goblin", "Gras", "Grey", "Guis", "Hail", "Hart", "Haver", "Helm", "Here", "Hex", "Hol", "Hop", "In", "Kelm", "Ken", "Kew", "Kil", "King", "Kirk", "Knight", "La", "Lam", "Lan", "Laner", "Laving", "Led", "Leo", "Lindis", "Lyd", "Lymp", "Mal", "Malmes", "Marsh", "Mel", "Mell", "Minchin", "Monk", "Mont", "Mow", "Muchel", "Net", "Nether", "Nev", "New", "Nib", "North", "Pen", "Per", "Pether", "Pew", "Pris", "Rad", "Rend", "Ring", "Rip", "Rock", "Rom", "Roth", "Sapper", "Sel", "Seming", "Shaftes", "Shield", "Shob", "Shrews", "Sid", "Sken", "Skip", "Somer", "South", "Spear", "Staf", "Stan", "Stan", "Staple", "Staun", "Stoke", "Sword", "Syd", "Taun", "Tavi", "Tel", "Tewkes", "Tint", "Titch", "Tiver", "Tort", "Tot", "Trout", "Uff", "Uffing", "Ulvers", "Uplea", "Urch", "Wan", "War", "Wel", "Wen", "West", "Whit", "Wide", "Wim", "Winch", "Wit", "Withing", "Wood", "Woot", "Wor", "Wot", "Wring", "Yat"];

			let syllable_2 = ["bane", "beck", "borne", "borough", "bourn", "bourne", "bray", "bridge", "burgh", "burn", "burton", "bury", "by", "chester", "comb", "combe", "con", "cost", "culme", "dal", "der", "dish", "don", "dor", "e", "east", "ent", "ern", "es", "farn", "fel", "field", "font", "ford", "frith", "glade", "glen", "gold", "gomery", "ham", "hampton", "house", "how", "hurst", "iard", "keep", "kirk", "lade", "land", "leigh", "leon", "ley", "lingham", "low", "meet", "mel", "mere", "minster", "moot", "mouth", "nard", "ne", "nes", "newton", "ney", "noller", "nor", "on", "pas", "peck", "rest", "ridge", "scott", "sey", "shire", "silver", "sley", "spring", "stock", "stoke", "ston", "stone", "sward", "swear", "tage", "ter", "tol", "ton", "ton", "ton", "ton", "ton", "ton", "ton", "ton", "ton", "ton", "town", "vale", "vern", "wall", "water", "well", "went", "west", "wick", "wood", "worth", "worthy", "yard"];

			let login = syllable_1[Math.round(Math.random()*(200 - 1))] + syllable_2[Math.round(Math.random()*(110 - 1))]
			if (this.$store.state.users.find(item => item.login === this.user_item.login)) {
				this.generate_login()
			} else {
				this.user_item.login = (login)
			}
		}
	},
	computed: {
		userList() {
			return this.$store.state.users.filter(item => item.user_id !== this.currentUser.user_id).sort((a, b) => a.user_id - b.user_id)
		},
		// scoreList() {
		// 	return this.$store.state.scores.sort((a,b) => a.score_id - b.score_id)
		// },
		getCheck() {
			return this.document.getElementById('checkbox').checked
		},
		user_type_list() {
			// let options = []
			// options.push({'type_u_id': null, 'type_u': "Выберите тип"})
			// for (let i in this.$store.state.user_types){
			// 	options.push({'type_u_id': i.type_u_id, 'type_u': i.type_u})
			// }
			return this.$store.state.user_types
		}
	}
}
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
.generator-btn {
	display: inline-block;
	box-sizing: border-box;
	padding: 0 20px;
	margin: 0 15px 15px 0;
	outline: none;
	border: none;
	border-radius: 4px;
	height: 32px;
	line-height: 32px;
	font-size: 14px;
	font-weight: 500;
	text-decoration: none;
	color: #fff;
	background-color: #3775dd;
	box-shadow: 0 2px #21487f;
	cursor: pointer;
	user-select: none;
	appearance: none;
	touch-action: manipulation;
	vertical-align: top;
}
.generator-btn:hover {
	background-color: #002fed;
}
.generator-btn:active {
	background-color: #2f599e !important;
}
.generator-btn:focus-visible {
	box-shadow: 0 0 0 3px lightskyblue;
}
.generator-btn:disabled {
	background-color: #6c87b5;
	pointer-events: none;
}
.button-71 {
	background-color: #0078d0;
	border: 0;
	border-radius: 56px;
	color: #fff;
	cursor: pointer;
	display: inline-block;
	font-family: system-ui,-apple-system,system-ui,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",sans-serif;
	font-size: 18px;
	font-weight: 600;
	outline: 0;
	padding: 16px 21px;
	position: relative;
	text-align: center;
	text-decoration: none;
	transition: all .3s;
	user-select: none;
	-webkit-user-select: none;
	touch-action: manipulation;
}
.button-71:before {
	background-color: initial;
	background-image: linear-gradient(#fff 0, rgba(255, 255, 255, 0) 100%);
	border-radius: 125px;
	content: "";
	height: 50%;
	left: 4%;
	opacity: .5;
	position: absolute;
	top: 0;
	transition: all .3s;
	width: 92%;
}
.button-71:hover {
	box-shadow: rgba(255, 255, 255, .2) 0 3px 15px inset, rgba(0, 0, 0, .1) 0 3px 5px, rgba(0, 0, 0, .1) 0 10px 13px;
	transform: scale(1.05);
}
@media (min-width: 768px) {
	.button-71 {
		padding: 16px 48px;
	}
}


</style>
