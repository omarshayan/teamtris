import { createApp} from 'vue'
import App from './App.vue'
import router from './router'
import VueAuth0Plugin from 'vue-auth0-plugin'
import { createStore, Store } from 'vuex'
import {store, key } from './store/store'
const app = createApp(App)

app.use(router)
// app.use(VueAuth0Plugin, {
//     domain: 'YOUR_AUTH0_DOMAIN',
//     client_id: 'YOUR_CLIENT_ID',
//     // ... other optional options ...
//   });
app.use(store, key)
app.mount('#app')
