<template>
  <div
    class="fill-box"
    @click="fill = !fill"
  >
    <Kinesin
      class="small-box"
      name="fill-box"
      :show="!fill"
    />
    <Kinesin
      class="full-box"
      name="fill-box"
      :show="fill"
    />
  </div>
</template>

<script>
import Kinesin from 'kinesin'

export default {
  components: {
    Kinesin
  },
  data () {
    return {
      fill: false
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
