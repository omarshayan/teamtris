<script setup lang='ts'>
    import NameEntryModal from '@/components/elements/NameEntryModal.vue';
    const emit = defineEmits(['onNameSubmit'])
    let onSubmit = async (e: any) => {
        console.log('name submitted')
        emit('onNameSubmit', e)    
    }
</script>
<template>
    <NameEntryModal
        @onSubmit:modal="onSubmit"
    >
    </NameEntryModal>
</template>