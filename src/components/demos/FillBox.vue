<template>
  <div
    class="fill-box"
    @click="fill = !fill"
  >
    <Kinesin
      class="small-box"
      name="fill-box"
      :show="show && !fill"
      :animate="animate"
    />
    <Kinesin
      class="full-box"
      name="fill-box"
      :show="show && fill"
      :animate="animate"
    />
  </div>
</template>

<script>
import Kinesin from 'kinesin'
import anime from 'animejs'

export default {
  components: {
    Kinesin
  },
  data () {
    return {
      fill: false,
      show: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.show = true
    }, 1000)
  },
  methods: {
    animate (el, from, done) {
      anime.remove(el)
      anime({
        targets: el,
        translateX: [from.translateX, 0],
        translateY: [from.translateY, 0],
        scaleX: [from.scaleX, 1],
        scaleY: [from.scaleY, 1],
        duration: 800,
        complete: done
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fill-box {
  margin: 20px 0;
  border: 1px solid black;
  height: 200px;
  width: 400px;

  .small-box {
    width: 50px;
    height: 50px;
    background: blue;
  }

  .full-box {
    position: relative;
    top: 50px;
    width: 100px;
    height: 100px;
    float: right;
    background: blue;
  }
}
</style>
