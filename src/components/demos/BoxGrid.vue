<template>
  <div class="box-grid">
    <div
      class="box-grid__outer-box"
      v-for="n in 48"
      :key="n"
    >
      <div
        class="box-grid__inner-box"
        @click="boxPosition = n"
      >
        <Kinesin
          class="box-grid__box-content"
          name="box-grid"
          :show="boxPosition === n"
        >
          <div class="box-grid__box-bg"></div>
        </Kinesin>
      </div>
    </div>
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
      boxPosition: 1
    }
  }
}
</script>

<style lang="scss" scoped>
.box-grid {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  width: 400px;

  &,
  &__outer-box {
    border: 2px solid black;
  }

  &__outer-box {
    flex: 1 1 12.5%;
  }

  &__inner-box {
    padding-top: 100%;
    position: relative;
    cursor: pointer;
  }

  &__box-content {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }

  .kinesin-box-grid {
    transition: transform 1s;
  }

  &__box-bg {
    height: 100%;
    width: 100%;
    background: red;
  }
}
</style>
