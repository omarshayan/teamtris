<script setup lang="ts">
    import router from '../../router';
    import Input from './Input.vue'

    const props = defineProps<{
        isHost: boolean,
    }>()

    const emit = defineEmits(['onSubmit:modal'])
    let onSubmit = async (e: any) => {
        console.log('setting name to: ' + e)
        emit('onSubmit:modal', e)    
    }
</script>
<template>
    <Input
        class="grid-item"
        :maxlength="4"
        :height="80"
        :width="256"
        @onSubmit:input="onSubmit"
        :sidebar="true"       
    ></Input>
</template>