<script setup lang='ts'>
    const props = defineProps({
        total: Number,
    })
</script>
<template>
    <span><slot></slot>/{{total}}</span>
</template>