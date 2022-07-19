<script setup lang='ts'>
  import Game from '@/components/layouts/Game.vue'
  import { useStore } from '@/store/store'

  // props
  const props = defineProps({
      connectCode: String
  })

  // state
  const store = useStore()
  console.log('guest store: ' ,store.state)
  const connectCode = store.state.lobby.code
</script>
<template>
  <Game2P
    :is-host="false"
    :connectCode="connectCode"
  >
  </Game2P>
</template>
<style scoped>
@import '@/assets/game.css';
</style>