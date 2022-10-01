<script setup lang="ts">
    import router from '../../router';
    import Input from './Input.vue'

    const props = defineProps<{
        host: boolean,

    }>()
    let onNameSubmit = async (e: any) => {
        console.log('setting name to: ' + e)
        if (props.host) {
            router.push('/host')
        }
        else if (props.host == false) {
            router.push('/guest')
        }
    }
</script>
<template>
    <Input
        class="grid-item"
        :maxlength="4"
        :height="80"
        :width="256"
        @onSubmit:input="onNameSubmit"
        :sidebar="true"       
    ></Input>
</template>