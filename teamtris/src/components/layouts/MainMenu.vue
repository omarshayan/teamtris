<script setup lang='ts'>
    import { useRouter } from 'vue-router'
    import MenuButton from "../elements/MenuButton.vue"
    import NewGameIcon from "../icons/NewGameIcon.vue"
    import Input from '../elements/Input.vue'
    import LobbyAPI, { Lobby } from '@/api/lobby'
    import { useStore } from '@/store/store'

    const router = useRouter()

    const store = useStore()

    let alphaNumeric = new RegExp(/^[a-zA-Z0-9]+$/)
    let api = new LobbyAPI()
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
        console.log(e)
        // validate alphanumeric and length?
        // check if a lobby exists with that connect code
        const lobby: Lobby = await api.getLobby(e)
        // show a loading screen
        // connect to lobby and ridirect to game

        if( e == lobby.code ) {
            store.commit('setConnectCode', lobby.code)
            router.push('/guest')
        } 
        console.log('lobby: ' , lobby)
    }

</script>


<template>
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
@import '@/assets/menu.css';
</style>