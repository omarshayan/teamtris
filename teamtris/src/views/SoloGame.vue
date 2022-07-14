<script setup lang='ts'>
  import { onMounted, ref } from 'vue'
  import Renderer from '@/composables/game/graphics'
  import Game from '@/composables/game/game'
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

  })
</script>
<template>
    <div class='box'>
      <div class='l-ui'>
        <canvas ref='holdCanvas' id='hold-canvas' :width='160' :height='96'></canvas>
        <p id=FPS>0</p>
      </div>
	    <canvas ref='boardCanvas' id='board-canvas' :width='320' :height='640'></canvas>
      <div class='r-ui'>
        <canvas ref='bagCanvas' id='bag-canvas' :width = '160' :height ='480' ></canvas>
        <h4 id=timer>0</h4>
        <h3 id=line-counter>0/40</h3>
      </div>
   </div>
</template>
<style scoped>
@import '@/assets/game.css';
</style>