<script setup lang='ts'>
  import { defineProps, onMounted, ref, reactive } from 'vue'

  import Button from '@/components/elements/Button.vue'

  import Renderer from '@/composables/game/graphics'
  import Game from '@/composables/game/game'
    import Game2P from '@/composables/game/game2p'
  import P2P from '@/composables/game/p2p'
  import ConfigState from '@/store/config'
  import { useStore } from '@/store/store'

  const store = useStore()



  const boardCanvas = ref<HTMLCanvasElement | null>(null)
  const holdCanvas = ref<HTMLCanvasElement | null>(null)
  const bagCanvas = ref<HTMLCanvasElement | null>(null)

  interface GameLocalState {
    game: Game | Game2P| null
  }
  const localstate: GameLocalState = reactive({
    game: null
  })

  const props = defineProps<{
    isHost?: boolean,
    connectCode?: string,
  }>()
  
  // events
  

  let onLobbyJoin = (game: Game2P) => {
      console.log('starting game!')
      localstate.game.run()
  }

  let startGame = (game: Game) => {
      console.log('startnig game...')
      localstate.game.run()
  }

  onMounted(() => {
    console.log('board canvas: ', boardCanvas)

    const canvases: {[id: string]: HTMLCanvasElement} = {
        'game': boardCanvas.value!,
        'bag': bagCanvas.value!,
        'hold': holdCanvas.value!,
    }

    const configuration = store.state.config
    const renderer = new Renderer(canvases)


    if (props.isHost != undefined) {
      localstate.game = new Game2P(configuration, renderer, props.isHost)
      const p2p = new P2P(props.isHost, localstate.game as Game2P, onLobbyJoin)
      console.log("two player game")
      if(props.isHost) {
        p2p.setup(props.isHost, localstate.game as Game2P, onLobbyJoin)
      }
      else if (!props.isHost) { 
        p2p.setup(props.isHost, localstate.game as Game2P, onLobbyJoin, props.connectCode)
      }
    }
  })


</script>
<template>
    <div class='box'>
      <div class='l-ui'>
        <canvas ref='holdCanvas' id='hold-canvas' :width='159' :height='96'></canvas>
        <p id=FPS>-1</p>
        <Button @on-click:button="startGame">start!</Button>
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