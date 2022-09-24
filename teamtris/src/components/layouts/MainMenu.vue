<script setup lang='ts'>
    import { useRouter } from 'vue-router'

    import MenuButton from "../elements/MenuButton.vue"
    import NewGameIcon from "../icons/NewGameIcon.vue"
    import ProfileBar from './ProfileBar.vue'
    import Input from '../elements/Input.vue'
    
    import lobbyAPI, { Lobby } from '@/api/data/lobby'
    import { useStore } from '@/store/store'

    import WebsocketConnection from '@/composables/game/p2p'
    
    const router = useRouter()

    const store = useStore()

    let alphaNumeric = new RegExp(/^[a-zA-Z0-9]+$/)

    // events
    let goToNewGame = () => {
        router.push('/host')
    }
    let goToSettings = () => {
        router.push('/settings')
    }
    let goToSoloGame = () => {
        router.push('/solo')
    }

    let onConnectCodeSubmit = async (e: any) => {
        console.log("code submitted :" , e)
        // validate alphanumeric and length?
        // check if a lobby exists with that connect code
        // const res = await api.invoke(lobbyAPI().byCode, undefined, {code: e})

        // if (!res) {
        //     console.warn('couln\'nt query lobby api')
        //     return
        // }
        // lobby = res
        // TODO: show a loading screen
        // connect to lobby and ridirect to game

        store.commit('setConnectCode', e)
        router.push('/guest')

    }

</script>


<template>

    <ProfileBar/>
    <div class='grid-container'>
        <div class='new-game-btn grid-item'>
            <MenuButton 
                @menu-button-on-click="goToNewGame()"
                :width="256"
                :height="512"
            >
                <template #menu-item-label>host a <br/>new game</template>
            </MenuButton>
        </div>
        <div class="nav-container grid-item">

            <MenuButton 
                class="grid-item"
                @menu-button-on-click="goToSoloGame()"
                :width="256"
                :height="35"
                :sidebar="true"
            >
                <template #menu-item-label>solo</template>
            </MenuButton>
            <MenuButton 
                class="grid-item"
                @menu-button-on-click="goToSettings()"
                :width="256"
                :height="35"
                :sidebar="true"
            >
                <template #menu-item-label>lobbies</template>
            </MenuButton>
            <MenuButton 
                class="grid-item"
                @menu-button-on-click="goToSettings()"
                :width="256"
                :height="35"
                :sidebar="true"
            >
                <template #menu-item-label>leaderboard</template>
            </MenuButton>
            <MenuButton 
                class="grid-item"
                @menu-button-on-click="goToSettings()"
                :width="256"
                :height="35"
                :sidebar="true"
            >
                <template #menu-item-label>settings</template>
            </MenuButton>
            <MenuButton 
                class="grid-item"
                @menu-button-on-click="goToSoloGame()"
                :width="256"
                :height="35"
                :sidebar="true"
            >
                <template #menu-item-label>about</template>
            </MenuButton>
            <Input
                class="grid-item"
                :maxlength="4"
                :regex="alphaNumeric"
                :height="80"
                :width="256"
                @onSubmit:input="onConnectCodeSubmit"
                :sidebar="true"
            ></Input>
        </div>
    </div>
</template>
<style>
@import '@/assets/css/menu.css';
</style>