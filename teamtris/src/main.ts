import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import VueAuth0Plugin from 'vue-auth0-plugin'

const app = createApp(App)

app.use(router)
// app.use(VueAuth0Plugin, {
//     domain: 'YOUR_AUTH0_DOMAIN',
//     client_id: 'YOUR_CLIENT_ID',
//     // ... other optional options ...
//   });

app.mount('#app')
