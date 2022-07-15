<script setup lang='ts'>
  import Game from '@/components/layouts/Game.vue'
</script>
<template>
  <Game
    :two-player="true"
    :is-host="false"
  >
  </Game>
</template>
<style scoped>
@import '@/assets/game.css';
</style>