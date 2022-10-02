<script setup lang='ts'>
  import Game2P from '@/components/layouts/Game2P.vue'
  import { useStore } from '@/store/store'
  import NameEntryModal from '@/components/layouts/NameEntry.vue'
  // props
  const props = defineProps({
      connectCode: String
  })

  // state
  const store = useStore()
  console.log('guest store: ' ,store.state)
  const connectCode = store.state.lobby.code

  let nameSubmitted = false
</script>

<template>
  <Game2P
    :num-lines="40"
    :is-host="false"
    :connectCode="connectCode"
  >
  </Game2P>
</template>
<style scoped>
@import '@/assets/css/game.css';
</style>