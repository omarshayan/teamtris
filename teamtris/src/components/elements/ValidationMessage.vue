<template>
    <span>{{ error }}</span>
    <slot></slot>
</template>
<script setup lang='ts'>
    import { defineProps } from 'vue'

    const props = defineProps({
        isShow: Boolean,
        error: String,
    })
</script>
<style scoped>
    span {
        color: red
    }
</style>