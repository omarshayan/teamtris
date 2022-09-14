<script setup lang="ts">
    import Button from './Button.vue';
</script>

<template>
    <div>lobby code:</div><br/>
    <Button @on-click:button="" :type="'code'">
        <slot name="code"></slot>
    </Button>
</template>