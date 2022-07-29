<template>
  <div class="container">
    <b-card
      bg-variant="dark"
      header="Vue_JWT_APP"
      text-variant="white"
      class="text-center"
    >
      <b-card-text>Already have an account? Login Here!</b-card-text>
      <div class="row">
        <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
          <form
            class="text-center border border-primary p-5"
            style="margin-top:70px;height:auto;padding-top:100px !important;"
            @submit.prevent="loginUser"
          >
              <Input
              ref='username'
              type="text"
              id="username"
              class="form-control mb-5"
              placeholder="username"
              @keydown:input="onUsernameInput"
              @on-submit:input="onUsernameSubmit"
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
            />
            <p>
              Dont have an account? Click
              <router-link to="/register"> here </router-link> to sign up
            </p>
            <!-- Sign in button -->
            <center>
              <button class="btn btn-primary btn-block w-75 my-4" type="submit">
                Sign in
              </button>
            </center>
          </form>
        </div>
      </div>
    </b-card>
  </div>
</template>
<script setup lang='ts'>
  import Input from '@/components/elements/Input.vue'
  import { useStore } from '@/store/store';
  import { ref } from 'vue'
  import api from '@/api/api';
  import users from '@/api/data/user'

  const store = useStore()

  let username = ''
  let password = ''

// events 

  let onUsernameInput = (e) => {
    username = e.target.value + e.key
  }

  let onPasswordInput = (e) => {
    password = e.target.value + e.key
  }

  let onUsernameSubmit = (e) => {

  }
   
  let onPasswordSubmit = (e) => {
    let loginInfo: string[] = [username, password]
   
   // api.invoke( users().login, undefined, undefined, {username: username, password: password})
   api.login(username, password)
  }
</script>
