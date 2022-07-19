<script setup>
    import {
        ref,
        onMounted,
    }   from 'vue'
    import Slider from '../elements/Slider.vue'
    import Input from '../elements/Input.vue'

    const input = ref(null)
    const slider = ref(null)


    const props = defineProps({
        initial: Number,
        maximum: Number,
        minimum: Number,
    })
    const emit = defineEmits([
        'update:value'
    ])

    const intRegex = new RegExp(/^\d+$/)

    // lifecycle

    onMounted(() => {
        slider.value.setSliderValue(props.initial)
        input.value.updateText(Math.round(props.initial))
    })

    // events

    let onInputKeyDown = (event) => {
        console.log(event)
    }
    let onInputUpdate = (event) => {
        emit('update:value', event)
        console.log(event)
        // update slider value
        slider.value.setSliderValue(event)
        // sliderVal = Number(message)
    }

    let onSliderUpdate = (event) => {
        emit('update:value', event)
        console.log(event)
        input.value.updateText(Math.round(event))
        // sliderVal = Number(message)
    }

</script>
<template>
    <slot class='label' name='label'></slot>
    <div class='flex-container'>
        <div class='flex-item'>
            <Input
                class='inputfield'
                ref='input'
                :digits="3"
                :regex="intRegex"
                :val="sliderVal"
                :width="80"
                :height="30"
                :maximum="maximum"
                :minimum="minimum"
                v-model="fieldVal"
                @update:input='onInputUpdate'
                @keydown:input='onInputKeyDown'
            />
            <slot class='unit-label' name='unit-label'></slot>
        </div>
        <div class='flex-item'>
            <Slider
                ref='slider'
                :maximum="maximum"
                :minimum="minimum"
                @update:val='onSliderUpdate'
            />
        </div>
    </div>

</template>
<style scoped>
.flex-container {
    display: flex;
    flex-direction: row;
    align-content: flex-start;
}

/* .flex-item {
    background-color:gray
} */

.inputfield {

    font-size: 18pt;
    height: 30px;
    /* width: 60px; */
}

.unit-label {
    position:relative;
    top:-20px;
    left:60px;
}
.input {
    width: 60px
}
/* @import '@/assets/settings.css'; */
</style>