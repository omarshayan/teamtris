<script setup>
    import {
        ref,
        reactive,
        onMounted,
    }   from 'vue'
    const input = ref(null)
    const emit = defineEmits(
        ['update:input',
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
        updateText
    })
    const props = defineProps({
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
        if (!(
            (e.key.length > 1) ||
            props.regex.test(e.key)
        )) e.preventDefault()
        console.log('regex fine')
        // check length
        if (
            props.maxlength < e.target.value.length
        ) e.preventDefault()
        console.log('length fine')
        //check max/min
        if (!( props.maximum && props.minimum ) && 
            ( props.maximum > parseFloat(String(input.value.value) + e.key))
        ) e.preventDefault()
        console.log('max/min fine, returning')

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
        emit('update:input', event.target.value)
    }
</script>

<template>
    <div>
        <input 
            ref=input
            class='input'
            step="1"
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