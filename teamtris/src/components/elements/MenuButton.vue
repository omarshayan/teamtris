<script>
    import { ref, onMounted } from 'vue'
    import gamePreviewRenderer from '../../composables/gamePreviewRenderer'


    export default {
        props: {
            height: Number,
            width: Number,
            sidebar: Boolean,
        },
        setup(props) {
            onMounted(() => {
                if(!props.sidebar){
                    console.log("mounted")
                    var canvas = document.getElementById('new-game-preview')
                    const newGameButtonRenderer = new gamePreviewRenderer(canvas)
                    newGameButtonRenderer.renderMenu()
                }
            })
        },
        data() {
            return { hover: false }
        },
    }
</script>

<template>
    <div 
        @click="$emit('menuButtonOnClick')"
        @mouseover="hover = true; $emit('menuButtonMouseOver')"
        @mouseleave="hover = false; $emit('menuButtonMouseLeave')"
        :height='height'
        :class="{'sidebar': sidebar, 'route-btn': true, 'hover': hover}"
    >
        <canvas v-if="!sidebar" id='new-game-preview' :width="width" :height="height"></canvas>
        <div v-if="sidebar" :class="{'label': true, 'new-game-label': !sidebar}">
            <slot name='menu-item-label'></slot>
        </div>
    </div>
</template>
<style>
@import '@/assets/menu.css'
</style>