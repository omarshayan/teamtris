<script setup lang='ts'>
  import Game2P from '@/components/layouts/Game2P.vue'
</script>
<template>
  <Game2P
    :num-lines="40"
    :is-host="true"
  >
  </Game2P>
</template>
<style scoped>
@import '@/assets/game.css';
</style>