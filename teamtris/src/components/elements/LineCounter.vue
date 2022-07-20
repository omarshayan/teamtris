<script setup lang='ts'>
    const props = defineProps({
        total: Number,
    })
</script>
<template>
    <span id='container'><slot></slot><div>/{{String(total)}}</div></span>
</template>
<style scoped>
slot {
    display: inline;
    font-size: 30px;
}

div {
    display: inline;
    font-size: 23px
}
</style>