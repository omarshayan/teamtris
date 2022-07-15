<script setup lang='ts'>
  import { defineProps, onMounted, ref } from 'vue'
  import Renderer from '@/composables/game/graphics'
  import Game from '@/composables/game/game'
  import ConfigState from '@/store/config'
  import { useStore } from '@/store/store'
  import Game2P from '@/composables/game/game2p'
  import P2P from '@/composables/game/p2p'

  const boardCanvas = ref<HTMLCanvasElement | null>(null)
  const holdCanvas = ref<HTMLCanvasElement | null>(null)
  const bagCanvas = ref<HTMLCanvasElement | null>(null)

  const props = defineProps<{
    twoPlayer: boolean,
    isHost?: boolean,
    connectCode?: string,
  }>()
  
  // events

  let onLobbyJoin = (game: Game2P) => {
      console.log('starting game!')
      game.run()
  }
  onMounted(() => {
    console.log('board canvas: ', boardCanvas)

    const canvases: {[id: string]: HTMLCanvasElement} = {
        'game': boardCanvas.value!,
        'bag': bagCanvas.value!,
        'hold': holdCanvas.value!,
    }

    const store = useStore()
    console.log('store : ' , store)
    const configuration = store.state.config
    console.log('configuration : ' , configuration)
    const renderer = new Renderer(canvases)


    if (props.twoPlayer && props.isHost != undefined) {
      let game = new Game2P(configuration, renderer, props.isHost)
      const p2p = new P2P(props.isHost, game, onLobbyJoin)
      console.log("two player game")
      if(props.isHost){
        p2p.setup(props.isHost, game, onLobbyJoin)
      }
      else if (!props.isHost){ 
        p2p.setup(props.isHost, game, onLobbyJoin, props.connectCode)
      }
    }
    else {
    let game = new Game(configuration, renderer)
    game.run()
    }

  })
</script>
<template>
    <div class='box'>
      <div class='l-ui'>
        <canvas ref='holdCanvas' id='hold-canvas' :width='159' :height='96'></canvas>
        <p id=FPS>-1</p>
      </div>
	    <canvas ref='boardCanvas' id='board-canvas' :width='319' :height='640'></canvas>
      <div class='r-ui'>
        <canvas ref='bagCanvas' id='bag-canvas' :width='159' :height ='480' ></canvas>
        <h3 id=timer>0</h3>
        <h3 id=line-counter>0/40</h3>
      </div>
   </div>
</template>
<style scoped>
@import '@/assets/game.css';
</style>