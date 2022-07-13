<script setup>
    import { 
        ref,
        defineProps
    }   from 'vue'
    import Slider from '../elements/Slider.vue'
    import Input from '../elements/Input.vue'

    var sliderVal = 0;
    const input = ref(null)
    const slider = ref(null)

    let updateInputField = (event) => {
        console.log(event)
        input.value.updateText(Math.round(event))
        // sliderVal = Number(message)
    }
    
    const props = defineProps({
        sliderVal: Number,
        fieldVal: Number,
        maximum: Number,
        minimum: Number,
    })

    const intRegex = /\d/
    let onInputKeyDown = (event) => {
        console.log(event)
    }
    let onInputUpdate = (event) => {
        console.log(event)
        // update slider value
        slider.value.setSliderValue(event)
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
                @update:val='updateInputField'
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

.flex-item {
    background-color:gray
}

.inputfield {

    font-size: 18pt;
    height: 30px;
    /* width: 60px; */
}

.input {
    width: 60px
}
/* @import '@/assets/settings.css'; */
</style>