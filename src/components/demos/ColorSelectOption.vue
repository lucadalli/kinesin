<template>
  <div class="cso">
    <div class="cso__dot-outer">
      <kinesin
        :show="isCurrentColor"
        @transitionstart="$emit('transitionstart', $event)"
        id="colorDot"
      >
        <div
          class="cso__dot"
          :style="{ background: dotColor }"
        />
      </kinesin>
    </div>
    <div class="cso__name">{{ color }}</div>
  </div>
</template>

<script>
import Kinesin from 'kinesin'

export default {
  components: {
    Kinesin
  },
  props: {
    color: {
      type: String,
      required: true
    },
    dotColor: {
      type: String,
      required: true
    },
    isCurrentColor: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
$dotSize: 0.5em;

.cso {
  cursor: pointer;
  user-select: none;

  &__dot-outer {
    height: $dotSize * 2;
    width: $dotSize * 2;
    margin: auto;
    padding: $dotSize / 2;
  }

  &__dot {
    height: $dotSize;
    width: $dotSize;
    background: black;
    border-radius: 50%;
    margin: auto;
    transition: background 0.6s;
  }
}

</style>
