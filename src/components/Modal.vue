<template>
	<div>
		<h2>Inline HTML</h2>
		<Modal btnText="Press me, senpai 😊"
					 modalContent="
            <div>
              <h2> Hello I am a modal</h2>
              <p>I like stating the obvious: <b>the obvious</b></p>
              <p>Now, try this trick: <code>Ctrl + Shift + W </code> 😉</p>
            </div>
            "
					 :closeBtn="true"
					 closeBtnContent="
            <span>X</span>
            "
		/>

		<h2>Passing component/s</h2>
		<Modal btnText="Press me, senpai 😊"
					 :closeBtn="true"
					 closeBtnContent="<span>X</span>"
		>
			<ExampleComponent/>
		</Modal>

		<h2>Multiple Content/Btns + Custom Functions</h2>
		<Modal
			:inception="true"
			@before-open="yourOpenFn()"
			@before-close="yourCloseFn()"
			:modals="[
        {
          btnText: 'Press me 1',
          modalContent: 'This is <strong>the</strong> content 1'
        },
        {
          btnText: 'Press me 2',
          modalContent:
            '<img src=\'https://media.giphy.com/media/5exwXWg9u7yow/giphy.gif\'>'
        },
        {
          btnText: 'Press me 3',
          modalContent: 'This is the <h3>content 3</h3>'
        }
      ]"
			:showNav="true"
		/>

		<h2>From Api/Json + Prev/Next Arrows</h2>
		<Modal
			:inception="true"
			@before-open="yourOpenFn()"
			@before-close="yourCloseFn()"
			:modals="formattedUsers"
			:showArrows="true"
		/>
	</div>
</template>

<script>
import Modal from "@melmacaluso/vue-modal"
import ExampleComponent from './ExampleComponent'
export default {
	data: () => {
		return {
			users: []
		}
	},
	components: {
		ExampleComponent
	},
	methods: {
		yourOpenFn() {
			console.log("yourOpenFn invoked.");
		},
		yourCloseFn() {
			console.log("yourCloseFn invoked.");
		}
	},
	mounted(){
		fetch('https://jsonplaceholder.typicode.com/users')
			.then(res => res.json())
			.then(res => this.users = res)
			.catch(err => console.log(err))
	},
	computed: {
		formattedUsers: function() {
			return this.users.map(user => {
				return {
					btnText: `${user.name}`,
					modalContent: `
            <h2>Email:${user.email}</h2>
            <h2>Phone:${user.phone}</h2>
          `
				};
			});
		}
	}
};
</script>

