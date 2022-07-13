<script>
    import MenuButton from "../elements/MenuButton.vue"
    import NewGameIcon from "../icons/NewGameIcon.vue"
    import Input from '../elements/Input.vue'

    export default {
        components: {
            MenuButton,
            NewGameIcon,
            Input,
        },
        methods: {
            goToNewGame() {
                this.$router.push('/host')
            },
            goToSettings() {
                this.$router.push('/settings')

            },
            goToSoloGame() {
                this.$router.push('/solo')
            }
        }
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
                    :maxlength="4"
                    :height="80"
                    :style="{ width: 256 }"
                ></Input>
            </div>
        </div>
</template>
<style>
@import '@/assets/menu.css';
</style>