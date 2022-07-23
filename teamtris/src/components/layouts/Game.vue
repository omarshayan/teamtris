<script setup lang='ts'>
  import { onMounted, ref, toRef, reactive, computed, watch, ComputedRef, onUnmounted } from 'vue'

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

  // props

  const props = defineProps({
    numLines: Number
  })

  const store = useStore()

  const timer = ref<number | undefined>()
  const lineCounter = ref<number | undefined>()
  const boardCanvas = ref<HTMLCanvasElement | null>(null)
  const holdCanvas = ref<HTMLCanvasElement | null>(null)
  const bagCanvas = ref<HTMLCanvasElement | null>(null)

  interface GameLocalState {
    game: Game | Game2P| null
    time: number
  }
  const localstate: GameLocalState = reactive({
    game: null,
    time: 0
  })

  
  // events

  let startGame = (game: Game) => {
      console.log('startnig game...')
      if(store.state.game.ready){
        localstate.game?.start()
      }
      else if (!store.state.game.ready){
        console.error('game not ready!')
      }
  
  }

  let goToMainMenu = () => {
    router.push('/')
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

    localstate.game = new Game(timer, lineCounter, configuration, renderer) as Game
    console.log('timer in solo :' , localstate.game.timer)

    store.commit('ready')
    console.log('game ready!')
  })

  onUnmounted(() => {
    console.log('unmounting game...')
    localstate.game?.stop()
  })

</script>
<template>
    <div class='box'>
      <div class='l-ui'>
        <canvas ref='holdCanvas' id='hold-canvas' :width='159' :height='96'></canvas>
        <p id=FPS>-1</p>
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
@import '@/assets/game.css';
</style>