<script setup lang="ts">
    import PlayerListItem from '@/components/elements/PlayerListItem.vue'
import { useStore } from 'vuex';

    const props = defineProps<{
        players: any[]
    }>()

</script>
<template>
    <table>
        <!-- <tr class='header'>
            players:
        </tr>
        <tr v-if="props.players[0]" class='host'>
            <PlayerListItem  :username="props.players[0].username"></PlayerListItem>
        </tr>
        <tr v-if="props.players[1]" class='guest'>
            <PlayerListItem  :username="props.players[1].username"></PlayerListItem>
        </tr> -->
    </table>
</template>