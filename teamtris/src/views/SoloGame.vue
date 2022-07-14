<script setup lang='ts'>
  import { onMounted, ref } from 'vue'
  import Renderer from '@/composables/game/graphics'
  import Game from '@/composables/game/game'
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


    const renderer = new Renderer(canvases)

    const game = new Game(renderer)
    game.run()

  })
</script>
<template>
    <div class='box'>
      <div class='l-ui'>
        <canvas ref='holdCanvas' id='hold-canvas' width='160px' height='96px'></canvas>
        <p id=FPS>0</p>
      </div>
	    <canvas ref='boardCanvas' id='board-canvas' width='320px' height='640px'></canvas>
      <div class='r-ui'>
        <canvas ref='bagCanvas' id="bag-canvas" width = "160px" height = "480" ></canvas>
        <h4 id=timer>0</h4>
        <h3 id=line-counter>0/40</h3>
      </div>
   </div>
</template>
<style scoped>
@import '@/assets/gamestyle.css';
</style>