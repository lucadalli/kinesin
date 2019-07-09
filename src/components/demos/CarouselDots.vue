<template>
  <div class="carousel-dots">
    <div
      v-for="n in 3"
      :key="n"
      class="dot"
      @click="currentDot = n"
    >
      <kinesin
        name="carousel-dot"
        :show="currentDot === n"
        :ignore-css-transforms="true"
      >
        <div class="dot-bg" />
      </kinesin>
    </div>
  </div>
</template>

<script>
import Kinesin from 'kinesin'

export default {
  data () {
    return {
      currentDot: 1
    }
  },
  components: {
    Kinesin
  }
}
</script>

<style lang="scss" scoped>
.carousel-dots {
  font-size: 3rem;
  transform-origin: 0 50%;
  transform: scale(0.5);

  .dot {
    display: inline-block;
    margin: 0 0.1em;
    width: 1em;
    height: 1em;
    border-radius: 50%;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.4);
    cursor: pointer;
  }

  .dot-bg {
    background: linear-gradient(45deg, #eb3349, #f45c43);
    height: 100%;
    width: 100%;
    border-radius: 50%;
  }

  .kinesin-carousel-dot {
    height: 100%;
  }
}
</style>
