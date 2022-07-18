<script setup lang='ts'>
    const emit = defineEmits([
        'on-click:button',
        'on-hover:button',
    ])
</script>

<template>
    <button
        @click="$emit('on-click:button')"
    >
        <slot></slot>
    </button>
</template>

<style>

</style>