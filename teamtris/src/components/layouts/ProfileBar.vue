<script setup lang="ts">

    import { reactive } from 'vue';
    import { RouterLink } from 'vue-router';

    import api from '@/api/api';
    import { useStore } from '@/store/store';

    const store = useStore()

    const state = reactive({username: ''})

    var loggedIn: boolean = false
    var username: string

    if (store.state.user.data){
        console.log(' a user is logge din ')
        console.log(store.state.user.data)
        loggedIn = true
        state.username = store.state.user.data.username;
        console.log(state.username)
    }


</script>

<template>
    <div class="grid-container">
        <div class="grid-item propic">

            <img width="60" src="src/assets/questionmark.jpeg"/>
        </div>
        <div class="grid-item nametag">
            <div v-if=loggedIn>{{ state.username }}</div>
            <div v-else>anonymous</div>
        </div>
        <div v-if=!loggedIn class="grid-item options">
            <RouterLink to="/login">login</RouterLink> <br/>
            <RouterLink to="/register">register</RouterLink>
        </div>
        <div v-else>
            <RouterLink to="/register">sign out</RouterLink>
        </div>
    </div> 

</template>


<style scoped>
    @import '@/assets/css/profilebar'
</style>