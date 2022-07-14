<template>
    <div
        ref="wrap"
        :id="id"
        class="slide-bar-wrap"
        @mousedown="onMouseDown"
        @mousemove="drag"
        @mouseup="onMouseUp"
        :style="{
            height: `30px`,
            width: '260px'
        }"
        >
            <div
            ref="elem"
            class="slide-bar"
            :style="{
                height: `30px`,
                width: '260px'
            }"
            >
                <template>
                    <div
                    ref="tooltip"
                    class="slide-bar-always slide-bar-tooltip-container"
                    :style="{'width': `${iconWidth}px`}"
                    >
                    <span
                        v-if="showTooltip"
                        class="slide-bar-tooltip-top slide-bar-tooltip-wrap"
                    >
                        <slot name="tooltip">
                        <span
                            :style="tooltipStyles"
                            class="slide-bar-tooltip"
                        >
                            {{ val }}
                        </span>
                        </slot>
                    </span>
                    </div>
                </template>
                <div
                    ref="process"
                    :style="processStyle"
                    class="slide-bar-process"
                />
            </div>
    </div>
</template>

<script>
    import { 
        defineProps
    } from 'vue'
    
    export default {
        name: 'slide-bar',
        props: ['maximum', 'minimum'],
        methods: {
            bindEvents() {
            document.addEventListener('mousemove', this.moving)
            document.addEventListener('mouseup', this.moveEnd)
            document.addEventListener('mouseleave', this.moveEnd)
            window.addEventListener('resize', this.refresh)
            },
            unbindEvents() {
            window.removeEventListener('resize', this.refresh)
            document.removeEventListener('mousemove', this.moving)
            document.removeEventListener('mouseup', this.moveEnd)
            document.removeEventListener('mouseleave', this.moveEnd)
            },
            mounted() {
            },
            beforeDestroy () {
                this.isComponentExists = false
                this.unbindEvents()
            },
            onMouseDown(e) {
                let mousePos = this.getMousePos(e)
                this.setSliderValue( this.$props.maximum * mousePos / parseFloat(this.$refs.elem.style['width']))
                this.dragging = true;
            },
            onMouseUp(e) {
                this.dragging = false;
            },
            getMousePos(e) {
                this.getStaticData()
                return e.clientX - this.offset
            },
            getStaticData () {
                if (this.$refs.elem) {
                    this.size = this.$refs.elem.offsetWidth
                    this.offset = this.$refs.elem.getBoundingClientRect().left
                }
            },
            setSliderValue (val, bool) {
                if (val < this.$props.minimum || val > this.$props.maximum) return false
                this.$refs.process.style.width = `${val/this.$props.maximum * parseFloat(this.$refs.elem.style['width'])}px`
                this.$refs.process.style['left'] = 0
                this.$emit('update:val', Math.round(val))
            },
            drag(e) {
                if (this.dragging) {
                    let mousePos = this.getMousePos(e)
                    this.setSliderValue( this.$props.maximum * mousePos / parseInt(this.$refs.elem.style['width']))
                }
            }
        },
    }
</script>
<style scoped>
.slide-bar-wrap {
  position: relative;
  box-sizing: border-box;
  user-select: none;
}
.slide-bar {
  position: relative;
  display: block;
  /* border-radius: 15px; */
  background-color: #636363;
  cursor: pointer;
}
.slide-bar-process {
  position: absolute;
  /* border-radius: 15px; */
  background-color: hsla(160, 100%, 37%, 1);
  transition: all 0s;
  z-index: 1;
  width: 0;
  height: 100%;
  top: 0;
  left: 0;
  will-change: width;
}
</style>