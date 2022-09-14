<script setup lang='ts'>
    import { User } from '@/api/data/user'
    import { defineProps } from 'vue';

    const props = defineProps<{
        user: User
    }>()

</script>

<template>
    <div class="grid-container">
        <div class="grid-item propic">
            <img width="30" src="src/assets/questionmark.jpeg"/>
        </div>
        <div class="grid-item name">
            {{props.user.username}}
        </div>
    </div>
    <div>  </div>
</template>