<template>
  <div class="cso">
    <div class="cso__dot-outer">
      <Kinesin
        :show="isCurrentColor"
        @transitionstart="$emit('transitionstart', $event)"
        id="color-dot"
      >
        <div
          class="cso__dot"
          :style="{ background: dotColor }"
        />
      </Kinesin>
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

<style lang="scss">
@keyframes bounce {
  from,
  20%,
  53%,
  80%,
  to {
    -webkit-animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }

  40%,
  43% {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    -webkit-transform: translate3d(0, -30px, 0);
    transform: translate3d(0, -30px, 0);
  }

  70% {
    -webkit-animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    animation-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
    -webkit-transform: translate3d(0, -15px, 0);
    transform: translate3d(0, -15px, 0);
  }

  90% {
    -webkit-transform: translate3d(0, -4px, 0);
    transform: translate3d(0, -4px, 0);
  }
}

.kinesin-color-dot .kinesin-animate {
  animation: bounce 0.6s;
}
</style>
