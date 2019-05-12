<template>
  <div class="color-select">
    <ColorSelectOption
      v-for="color in colorOptions"
      :key="color"
      :color="color"
      :dotColor="dotColor"
      :isCurrentColor="color === currentColor"
      @click.native="currentColor = color"
      @transitionstart="changeDotColor"
    />
  </div>
</template>

<script>
import ColorSelectOption from './ColorSelectOption.vue'

const colorOptions = [
  'Red',
  'Green',
  'Blue'
]

export default {
  components: {
    ColorSelectOption
  },
  data () {
    return {
      colorOptions,
      currentColor: colorOptions[0],
      dotColor: colorOptions[0]
    }
  },
  methods: {
    changeDotColor () {
      this.dotColor = this.currentColor
    }
  }
}
</script>

<style lang="scss" scoped>
  .color-select {
    display: flex;
    justify-content: space-around;
    max-width: 400px;
  }
</style>
