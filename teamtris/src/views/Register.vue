<template>
  <div class="container">
    <b-card
      bg-variant="dark"
      header="Welcome to the Vue JWT App"
      text-variant="white"
      class="text-center"
    >
      <b-card-text>Register Here!</b-card-text>
      <div class="row">
        <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
          <form
            class="text-center border border-primary p-5"
            style="margin-top:70px;height:auto;padding-top:100px !important;"
            @submit.prevent="registerUser"
          >
            <Input
              ref='username'
              type="text"
              id="username"
              class="form-control mb-5"
              placeholder="username"
              @keydown:input="onUsernameInput"
              @on-submit:input="onUsernameSubmit"
              v-model="usernametext"
            />
            <!-- Password -->
            <Input
              ref='password'
              type="password"
              id="password"
              class="form-control mb-5"
              placeholder="password"
              @on-submit:input="onPasswordSubmit"
              @keydown:input="onPasswordInput"
              v-model="passwordtext"
            />
            <p>
              Already have an account? Click
              <router-link to="/login">here</router-link> to sign in
                <Button
                  @on-click:button="onSubmit"
                  class="btn btn-primary btn-block w-75 my-4"
                  type="submit"
                >
                  Sign up
                </Button>
            </p>
          </form>
        </div>
      </div>
    </b-card>
  </div>
</template>
<script setup lang='ts'>


// events

  import api from '@/api/api'
  import { ref, reactive } from 'vue'
  import Input from '@/components/elements/Input.vue'
  import Button from '@/components/elements/Button.vue'

  const register = reactive({ 
    username: '',
    password: ''
  })

  const usernametext = ref('')
  const passwordtext = ref('')

  let username: string
  let password: string

  let onUsernameInput = (e) => {
    username = e.target.value
  }

  let onPasswordInput = (e) => {
    password = e.target.value
  }

  let onUsernameSubmit = (e) => {

  }

  let onPasswordSubmit = (e) => {
    let loginInfo: string[] = [username, password]
    console.log('submitting password')
    // api.invoke( users().login, undefined, undefined, {username: username, password: password})
    api.register(username, password)
  }

  let onSubmit = (e) => {
    console.log('submitting :\nusername: ', usernametext, '\npassword: ', passwordtext)
  }

</script>
