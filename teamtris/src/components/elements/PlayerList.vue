<script setup lang="ts">
    import { User } from '@/api/data/user'
    import PlayerListItem from '@/components/elements/PlayerListItem.vue'
import { useStore } from 'vuex';

    useStore
    let updateGuest = (guest: User) {

    }
    
</script>
<template>
    <table>
        <tr class='header'>
            players:
        </tr>
        <tr class='host'>
            <PlayerListItem :user=""
        </tr>
        <tr class='guest'>

        </tr>
    </table>
</template>