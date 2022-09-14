<script setup lang='ts'>
  import { defineProps, onMounted, ref, reactive } from 'vue'

  import Button from '@/components/elements/Button.vue'

  import Renderer from '@/composables/game/graphics'
  import Game from '@/composables/game/game'
    import Game2P from '@/composables/game/game2p'
  import P2P from '@/composables/game/p2p'
  import ConfigState from '@/store/config'
  import { useStore } from '@/store/store'
  import router from '@/router'
  import Timer from '@/components/elements/Timer.vue'
  import LineCounter from '@/components/elements/LineCounter.vue'
  import ConnectCodeScreen from '../elements/ConnectCodeScreen.vue'

  const props = defineProps<{
    numLines: number,
    isHost: boolean,
    connectCode?: string,
  }>()

  const store = useStore()

  const code = ref<string | undefined>()
  const timer = ref<number | undefined>()
  const lineCounter = ref<number | undefined>()
  const boardCanvas = ref<HTMLCanvasElement | null>(null)
  const holdCanvas = ref<HTMLCanvasElement | null>(null)
  const bagCanvas = ref<HTMLCanvasElement | null>(null)

  interface GameLocalState {
    game: Game2P| null
  }
  const localstate: GameLocalState = reactive({
    game: null
  })

  
  // events
  

  let goToMainMenu = () => {
    router.push('/')
  }

  let onLobbyJoin = (game: Game2P) => {
      console.log('lobby joined')
  }

  let startGame = (game: Game) => {
      console.log('startnig game...')
      console.log('connectcode: ', code)
      navigator.clipboard.writeText(code.value!)
      // localstate.game?.start()
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


      localstate.game = new Game2P(timer, lineCounter, configuration, renderer, props.isHost) as Game2P
      const p2p = new P2P(props.isHost, localstate.game, onLobbyJoin, code)
      console.log("two player game")
      if(props.isHost) {
        p2p.setup(props.isHost, localstate.game, onLobbyJoin)
      }
      else if (!props.isHost) { 
        p2p.setup(props.isHost, localstate.game, onLobbyJoin, props.connectCode)
      }

    

  })


</script>
<template>
    <div class='box'>
      <div class='l-ui'>
        <canvas ref='holdCanvas' id='hold-canvas' :width='159' :height='96'></canvas>
        <ConnectCodeScreen><template #code>{{ code }}</template></ConnectCodeScreen>
        <Button :style="{ margin: '10px' }" @on-click:button="startGame">start!</Button>
        <Button :style="{ margin: '10px' }" @on-click:button="goToMainMenu">back</Button>

      </div>
	    <canvas ref='boardCanvas' id='board-canvas' :width='320' :height='736'></canvas>
      <div class='r-ui'>
        <canvas ref='bagCanvas' id='bag-canvas' :width='159' :height ='480' ></canvas>
        <div id='stats-box'>
          <Timer class='timer'>{{ timer?.toFixed(3) }}</Timer>
          <LineCounter class='line-counter' :total="numLines">{{ lineCounter }}</LineCounter>
        </div>
      </div>
   </div>
</template>
<style scoped>
@import '@/assets/css/game.css';
</style>