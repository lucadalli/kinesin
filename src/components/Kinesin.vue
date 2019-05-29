<script>
import Vue from 'vue'

const bus = new Vue()

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
      receivedFrom: this.show
    }
  },
  computed: {
    className () {
      return 'kinesin-' + this.name
    },
    isReadyToRender () {
      return this.show && this.receivedFrom
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
      this.from = pos
      this.receivedFrom = this.show
    },
    enter (el, done) {
      if (this.from) {
        el.style.transition = 'all 0s ease 0s' // no transition
        el.style.transform = this.translateRelativeOffset(el)
        el.className = `${this.className} kinesin-active kinesin-from`
        this.$emit('transitionstart')
        // force document reflow
        this.$_reflow = document.body.offsetHeight
        el.style.removeProperty('transition')
        el.style.removeProperty('transform')
        el.className = `${this.className} kinesin-active kinesin-to`
        const onTransitionEnd = e => {
          if (e.target === el) {
            el.removeEventListener('transitionend', onTransitionEnd)
            el.className = ''
            this.$emit('transitionend')
            done()
          }
        }
        el.addEventListener('transitionend', onTransitionEnd)
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
          {},
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
