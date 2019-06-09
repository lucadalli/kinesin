<script>
import Vue from 'vue'

const bus = new Vue() // event bus

const getPosition = el => {
  const rect = el.getBoundingClientRect()
  return {
    top: rect.top,
    left: rect.left
  }
}

export default {
  props: {
    name: {
      type: [String, Number],
      required: true
    },
    group: {
      type: [String, Number],
      default: 'default'
    },
    show: {
      type: Boolean,
      required: true
    },
    tag: {
      type: String,
      default: 'div'
    },
    animateTag: {
      type: String,
      default: 'div'
    }
  },
  data () {
    return {
      from: null,
      isIntendedPosRecipient: this.show,
      // isIntendedPosRecipient initialiased as show such that if show is true,
      // isReadyToRender is also true, rendering the element on mounted
      state: 'from',
      style: {}
    }
  },
  computed: {
    baseClass () {
      return `kinesin-${this.name} kinesin`
    },
    class () {
      if (this.state === 'from') {
        return [this.baseClass, 'kinesin-active kinesin-from']
      }
      if (this.state === 'to') {
        return [this.baseClass, 'kinesin-active kinesin-to']
      }
      return this.baseClass
    },
    isReadyToRender () {
      return this.show && this.isIntendedPosRecipient
    },
    eventName () {
      return `_${this.group}_${this.name}`
    }
  },
  created () {
    bus.$on(this.eventName, this.onPositionReceived)
  },
  destroyed () {
    bus.$off(this.eventName, this.onPositionReceived)
  },
  methods: {
    onPositionReceived (pos) {
      this.isIntendedPosRecipient = this.show
      if (this.isIntendedPosRecipient) {
        this.from = pos
      }
    },
    enter (el, done) {
      if (this.from) {
        this.style = {
          transition: 'all 0s ease 0s', // no transition
          transform: this.translateRelativeOffset(el)
        }
        this.$emit('transitionstart')
        this.$nextTick(() => { // wait for DOM update
          this.$_reflow = document.body.offsetHeight // force document reflow
          this.state = 'to'
          this.style = {}
          const onTransitionEnd = e => {
            if (e.target === el) {
              el.removeEventListener('transitionend', onTransitionEnd)
              this.state = 'idle'
              this.$emit('transitionend')
              done()
            }
          }
          el.addEventListener('transitionend', onTransitionEnd)
        })
      } else {
        this.state = 'idle'
      }
    },
    leave (el, done) {
      this.$nextTick(() => {
        this.updatePosition(el)
        done()
      })
    },
    updatePosition (el) {
      bus.$emit(this.eventName, getPosition(el))
    },
    translateRelativeOffset (el) {
      const fromPos = this.from
      const thisPos = getPosition(el)
      return `translate3d(${fromPos.left - thisPos.left}px, ${fromPos.top - thisPos.top}px, 0)`
    }
  },
  render (h) {
    return h(
      'transition',
      {
        props: {
          css: false,
          appear: true
        },
        on: {
          enter: this.enter,
          leave: this.leave
        }
      },
      this.isReadyToRender ? [
        h(
          this.tag,
          {
            class: this.class,
            style: this.style
          },
          [
            h(
              this.animateTag,
              {
                staticClass: 'kinesin-animate'
              },
              this.$slots.default
            )
          ]
        )
      ] : null
    )
  }
}
</script>

<style scoped>
.kinesin-active {
  /* default transition property, intended to be overridden */
  transition: transform 0.6s;
}
.kinesin-animate {
  height: 100%;
}
</style>
