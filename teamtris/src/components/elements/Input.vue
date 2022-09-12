<script setup>
    import {
        ref,
        reactive,
        onMounted,
    }   from 'vue'
    const input = ref(null)
    const emit = defineEmits([
        'update:modelValue',
        'update:input',
        'keydown:input',
        'onSubmit:input',]
    )
    function updateText(text){
        if(/^\d+$/.test(parseFloat(text))) {
            console.log('updating text with ', text)
        
            input.value.value = text
        }
    }
    defineExpose({
        updateText,
        input
    })
    const props = defineProps({
        modelValue: String,
        height: Number,
        width: Number,
        maximum: Number,
        minimum: Number,
        inputVal: Number,
        maxlength: Number,
        regex: RegExp,
    })

    onMounted(() => {
            const height = input.value.clientHeight;
        const fontstyle = height + 'px'
        console.log('input height: ' , fontstyle)

    })

    const validateInput = (e) => {
        // check regex
        if ((
            props.regex &&
            !props.regex.test(e.key)
        )) e.preventDefault()
        // check length
        if (
            props.maxlength < e.target.value.length
        ) e.preventDefault()
        //check max/min
        if (!( props.maximum && props.minimum ) && 
            ( props.maximum > parseFloat(String(input.value.value) + e.key))
        ) e.preventDefault()

        return
    };
    let onInputKeyDown = (event) => {
        emit('keydown:input', event, event.target.value)
        // check if form submission (enter, maybe hitting max chars?)
        if (event.key == 'Enter') {
            emit('onSubmit:input', event.target.value)
        }
        validateInput(event)
    }
    

    let onInputUpdate = (event) => {
        console.log('updating input ', event)
        emit('update:input', event.target.value)
        // for v-model binding
        emit('update:modelValue', event.target.value)
    }
</script>

<template>
    <div>
        <input 
            ref=input
            class='input'
            step="1"
            :maxlength="maxlength"
            :value="modelValue"
            @input="onInputUpdate"
            @keydown="onInputKeyDown"
            :style="fontstyle"
        />
    </div>
</template>

<style scoped>
/* @import '@/assets/css/settings.css' */
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