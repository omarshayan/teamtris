<script setup lang='ts'>
    import { defineProps } from 'vue';

    const props = defineProps<{
        username: string
    }>()

</script>

<template>
    <div class="grid-container">
        <div class="grid-item propic">
            <img width="30" src="src/assets/questionmark.jpeg"/>
        </div>
        <div class="grid-item name">
            {{props.username}}
        </div>
    </div>
    <div>  </div>
</template>