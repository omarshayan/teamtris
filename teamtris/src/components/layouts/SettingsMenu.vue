<!-- <template>
    <div id="settings" class="box">
      <span id="settings-back" class="back-btn">&#60;-</span>
      <form name="settings-input">
        <label for="arr-input">ARR (ms):</label><br>
        <input type="range" class="slider" id="arr-input" name="setting-input"
        oninput="document.getElementById('arr-output').innerText = this.value">
        <span id="arr-output" class="setting-output">50</span><br>
        <label for="das-input">DAS (ms):</label><br>
        <input type="range" class="slider" id="das-input" name="setting-input"
               oninput="document.getElementById('das-output').innerText = Math.round(this.value*3.33)">
        <span id="das-output" class="setting-output">167</span><br>
        <label for="sdf-input">SDF:</label><br>
        <input type="range" class="slider" id="sdf-input" name="setting-input"
        oninput="document.getElementById('sdf-output').innerText = this.value">
        <span id="sdf-output" class="setting-output">50</span><br>
        <input type="submit" id="setting-submit" value="save">
      </form>
    </div>
</template> -->
<script setup>
    import { Store, useStore } from 'vuex'
    import { key } from '@/store/store'
    import InputSlider from "../elements/InputSlider.vue"

    const store = useStore(key)
    console.log("arr ", store.state.config.arr)

    // setting setters
    const updateArr = (val) => {
        console.log('updating Arr to ', val)
        store.commit('setArr', val)
    }
    const updateDas = (val) => {
        console.log('updating das to ', val)
        store.commit('setDas', val)
    }
    const updateDcf = (val) => {
        console.log('updating dcfs to ', val)
        store.commit('setDcf', val)
    }
    const updateSdf = (val) => {
        console.log('updating sdf to ', val)
        store.commit('setSdf', val)
    }
</script>
<template>
    <div class='grid-container'>
        <div class='l-col'>
            <div class='grid-item'>
                <InputSlider
                    class='grid-item'
                    :maximum="100"
                    :minimum="1"
                    @update:value="updateArr"
                    :initial="store.state.config.arr"
                >
                    <template v-slot:label>
                        ARR
                    </template>
                   <template v-slot:unit-label>
                       ms
                   </template>
                </InputSlider>
            </div>
            <div class='grid-item'>
                <InputSlider
                    class='grid-item'
                    :maximum="333"
                    :minimum="10"
                    @update:value="updateDas"
                    :initial="store.state.config.das"
                >
                    DAS
                    <template v-slot:label>
                        DAS
                    </template>
                   <template v-slot:unit-label>
                       ms
                   </template>
                </InputSlider>
            </div>
            <div class='grid-item'>
                <InputSlider
                    class='grid-item'
                    :maximum="333"
                    :minimum="0"
                    @update:value="updateDcf"
                    :initial="store.state.config.dcf"
                >
                    <template v-slot:label>
                        DCF
                    </template>
                   <template v-slot:unit-label>
                       ms
                   </template>
                </InputSlider>
            </div>
            <div class='grid-item'>
                <InputSlider
                    class='grid-item'
                    :maximum="100"
                    :minimum="1"
                    @update:value="updateSdf"
                    :initial="store.state.config.sdf"
                >
                    <template v-slot:label>
                        SDF
                    </template>
                   <template v-slot:unit-label>
                       X
                   </template>
                </InputSlider>
            </div>
        </div>
    </div>

</template>
<style scoped>
.grid-container {
    width: 768px;
    height: 384px;
    margin-right: auto;
    margin-left: auto;
    display: grid;
    grid-template-columns: 384px 384px;
    column-gap: 20px;
    border-color: aqua;
    border-width: 1em;
}

.l-col {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.nav-container {
    display: grid;
    grid-template-rows: 64px 64px 64px 64px;
    row-gap: 20px;
}
</style>