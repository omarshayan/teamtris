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
              type="text"
              id="username"
              class="form-control mb-5"
              placeholder="username"
              v-model="usernametext"
            />
            <!-- Password -->
            <Input
              type="password"
              id="password"
              class="form-control mb-5"
              placeholder="password"
              v-model="passwordtext"
            />
            <ValidationMessage
              v-if="formError"
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
  import { ref, reactive, useCssVars } from 'vue'
  import Input from '@/components/elements/Input.vue'
  import ValidationMessage from '@/components/elements/ValidationMessage.vue'
  import Button from '@/components/elements/Button.vue'


  let formValidation = reactive({ 
    usernameError: '',
    passwordError: '',
  }) 

  let formError: boolean = false
  const usernametext = ref('')
  const passwordtext = ref('')


  let onUsernameSubmit = (e) => {

  }

  let onPasswordSubmit = (e) => {
    console.log('submitting password')
    // api.invoke( users().login, undefined, undefined, {username: username, password: password})
  }

  let onSubmit = async (e) => {
    const user = usernametext.value
    const pass = passwordtext.value 
    console.log('submitting :\nusername: ', user, '\npassword: ', pass)
    api.register(user, pass).then( (res) => {
      console.log(res)
      if(res.status = false){
        formError = true
      }
    })
    // const res = await api.register(user, pass)
    // console.log
}

</script>
