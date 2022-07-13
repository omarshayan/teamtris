<script setup>
    import {
        ref,
        reactive,
        defineProps,
        defineEmits,
        defineExpose,
        onMounted,
    }   from 'vue'
    const input = ref(null)
    const emit = defineEmits(
        ['update:input',
        'keydown:input']
    )
    function updateText(text){
        if(/^\d+$/.test(parseFloat(text))) {
            console.log('updating text with ', text)
        
            input.value.value = text
        }
    }
    defineExpose({
        updateText
    })
    const props = defineProps({
        height: Number,
        width: Number,
        maximum: Number,
        minimum: Number,
        inputVal: Number,
        maxlength: Number,
    })

    onMounted(() => {
            const height = input.value.clientHeight;
        const fontstyle = height + 'px'
        console.log('input height: ' , fontstyle)

    })

    const intRegex = /\d/
    const integerChange = (event) => {
        if (
            (event.key.length > 1) ||
            (intRegex.test(event.key) &&
            ( props.maxlength > (String(input.value.value).length)))
        ) return
        if (
            ( props.maximum && props.minimum ) && 
            ( props.maximum > parseFloat(String(input.value.value) + event.key))
            // ( props.minimum < parseFloat(String(input.value.value) + event.key))
        ) return
        event.preventDefault()
    };
    let onInputKeyDown = (event) => {
        emit('keydown:input', event, event.target.value)
        integerChange(event)
    }
    let onInputUpdate = (event) => {
        emit('update:input', event.target.value)
    }
</script>

<template>
    <div>
        <input 
            ref=input
            class='input'
            type="number"
            step="1"
            pattern="^[-/d]/d*$"
            :maxlength="maxlength"
            :value="inputVal"
            @input="onInputUpdate"
            @keydown="onInputKeyDown"
            :style="fontstyle"
        />
    </div>
</template>

<style scoped>
/* @import '@/assets/settings.css' */
    *, *::before, *::after {
    box-sizing: border-box;
    }

    input {
        border: none;
        -webkit-appearance: none;
        -ms-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background: rgb(63, 63, 63);
        padding: 12px;
        border-radius: 3px;
        color: rgb(214, 214, 214);
        font-size: v-bind(fontstyle);
        font-family: 'Courier';
        height: v-bind(height + 'px');
        width: v-bind(width + 'px');
    }
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type=number] {
        -moz-appearance: textfield;
    }
</style>