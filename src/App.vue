<template>
  <div id="app">
    <ColorSelectDemo />
  </div>
</template>

<script>
import ColorSelectDemo from '@/components/demos/ColorSelect.vue'

export default {
  name: 'app',
  components: {
    ColorSelectDemo
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Rubik:500');

#app {
  font-family: 'Rubik', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

*, *:before, *:after {
  box-sizing: border-box;
}
</style>
