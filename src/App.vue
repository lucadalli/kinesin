<template>
  <div id="app">
    <ColorSelectDemo />
    <CarouselDots />
  </div>
</template>

<script>
import ColorSelectDemo from '@/components/demos/ColorSelect.vue'
import CarouselDots from '@/components/demos/CarouselDots.vue'

export default {
  name: 'app',
  components: {
    ColorSelectDemo,
    CarouselDots
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
