<script setup lang='ts'>
  import Game2P from '@/components/layouts/Game2P.vue'
  import { useStore } from '@/store/store'
  import NameEntry from '@/components/layouts/NameEntry.vue'
  import { reactive, computed, nextTick, ref } from 'vue';
  // props
  const props = defineProps({
    connectCode: String,
    isHost: Boolean
  })

  // state
  const store = useStore()
  console.log('guest store: ' ,store.state)
  const connectCode = store.state.lobby.code

  const nameSubmitted = ref(false)
  let onNameSubmit = async(name: any) => {
    console.log("name submitted: ", name)
    await nextTick()
    nameSubmitted.value = true
    store.commit('setName', name)
    await nextTick()
  }
</script>

<template>
  <NameEntry v-if="!nameSubmitted"
    :is-host="false" 
    @onNameSubmit=onNameSubmit
  >
  </NameEntry>
  <Game2P v-else
    :num-lines="40"
    :is-host="props.isHost"
    :connectCode="props.connectCode"
  >
  </Game2P>
</template>
<style scoped>
@import '@/assets/css/game.css';
</style>