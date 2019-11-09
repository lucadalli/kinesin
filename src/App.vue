<template>
  <div id="app">
    <ColorSelectDemo />
    <CarouselDots />
    <BoxGrid />
    <FillBox />
  </div>
</template>

<script>
import ColorSelectDemo from '@/components/demos/ColorSelect.vue'
import CarouselDots from '@/components/demos/CarouselDots.vue'
import BoxGrid from '@/components/demos/BoxGrid.vue'
import FillBox from '@/components/demos/FillBox.vue'

export default {
  name: 'app',
  components: {
    ColorSelectDemo,
    CarouselDots,
    BoxGrid,
    FillBox
  }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Rubik:500");

#app {
  font-family: "Rubik", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}

*,
*:before,
*:after {
  box-sizing: border-box;
}
</style>
