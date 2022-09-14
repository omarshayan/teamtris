<script setup lang='ts'>
    const emit = defineEmits([
        'on-click:button',
        'on-hover:button',
    ])

    const props = defineProps({
        type: String
    })

</script>

<template>
    <button
        @click="$emit('on-click:button')"
        :class="props.type? props.type : 'default'"
    >
        <slot></slot>
    </button>
</template>

<style>
    @import '@/assets/css/menu.css';
    @font-face {
    font-family: 'Floppy Pixel Regular';
    src: url('/src/assets/fonts/Floppy Pixel Regular');
    src: url('/src/assets/fonts/Floppy\ Pixel\ Regular.eot') format('embedded-opentype'),
         url('/src/assets/fonts/FloppyPixelRegular.woff') format('woff'),
         url('/src/assets/fonts/Floppy\ Pixel\ Regular.ttf') format('truetype'),
         url('/src/assets/fonts/Floppy\ Pixel\ Regular.svg') format('svg');
    font-weight: normal;
    font-style: normal;
   }

    .default {
        height: 40px;
        font-size: 30px;
        color: white;
        background-color: black;
    }

    .code {
        height: 40px;
        font-size: 30px;
        color: greenyellow;
        background-color: black;
    }
</style>