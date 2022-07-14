<script setup lang='ts'>
  import { onMounted, ref } from 'vue'
  import Renderer from '@/composables/game/graphics'
  import Game2P from '@/composables/game/game2p'
  import ConfigState from '@/store/config'
  import { useStore } from '@/store/store'
  const boardCanvas = ref<HTMLCanvasElement | null>(null)
  const holdCanvas = ref<HTMLCanvasElement | null>(null)
  const bagCanvas = ref<HTMLCanvasElement | null>(null)

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

    const game = new Game(configuration, renderer)
    game.run()

  })</script>
<template>
    <div class="box">
      <div class="multiplayer-menu">
        <h1 id='lobby code'></h1>
        <div id='player list'></div>
        <button id='start button'> start! </button>
        <div id="chat-history"></div>
        <form name="chat-input">
          <input type="text" id="chat-input" name="chat-input"><br>
          <label for="chat-input">chat</label>
        </form>
      </div>
      <div class="l-ui">
        <canvas id="hold-canvas" width="160px" height="96px"></canvas>
        <p id=FPS>0</p>
      </div>
	    <canvas id="board-canvas" width="320px" height="640px"></canvas>
      <div class="r-ui">
        <canvas id="bag-canvas" width = "160px" height = "480" ></canvas>
        <div id=timer>0</div>
        <div id=line-counter>0/40</div>
        <div id=turn>?</div>
      </div>
   </div>
</template>