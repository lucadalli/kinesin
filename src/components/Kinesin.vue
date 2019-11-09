<script>
import Vue from 'vue'

const bus = new Vue() // event bus

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
    ignoreCssTransforms: {
      type: Boolean,
      default: false
    },
    transitionSize: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      from: null,
      isIntendedPosRecipient: this.show,
      // 'isIntendedPosRecipient' initialiased as 'show' such that if 'show' is true on mounted,
      // computed property 'isReadyToRender' is also true, hence rendering the element
      state: 'idle',
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
  beforeDestroy () {
    bus.$off(this.eventName, this.onPositionReceived)
  },
  methods: {
    getPositionAndSize (el) {
      if (this.ignoreCssTransforms) {
        let top = 0
        let left = 0
        let element = el

        // Traverse the DOM tree upwards to find the
        // cumulative offsets without considering CSS transforms
        do {
          top += element.offsetTop || 0
          left += element.offsetLeft || 0
          element = element.offsetParent
        } while (element)

        return {
          top,
          left,
          width: el.offsetWidth,
          height: el.offsetHeight
        }
      }
      const rect = el.getBoundingClientRect()
      return {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      }
    },
    updatePosition (el, state) {
      bus.$emit(this.eventName, this.getPositionAndSize(el), state)
    },
    determineTransform (el) {
      const fromState = this.from
      const thisState = this.getPositionAndSize(el)
      if (this.transitionSize) {
        const xScaleOffset = (fromState.width - thisState.width) / 2
        const yScaleOffset = (fromState.height - thisState.height) / 2
        const translation = `translate3d(${fromState.left - thisState.left + xScaleOffset}px, ${fromState.top - thisState.top + yScaleOffset}px, 0)`
        const scale = `scale(${fromState.width / thisState.width}, ${fromState.height / thisState.height})`
        return `${translation} ${scale}`
      }
      return `translate3d(${fromState.left - thisState.left}px, ${fromState.top - thisState.top}px, 0)`
    },
    onPositionReceived (pos, state) {
      this.isIntendedPosRecipient = this.show
      if (this.isIntendedPosRecipient) {
        this.from = pos
        this.state = state
      }
    },
    enter (el, done) {
      if (this.from) {
        this.state = 'from'
        this.style = {
          transition: 'all 0s ease 0s', // no transition
          transform: this.determineTransform(el)
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
      }
    },
    leave (el, done) {
      this.$nextTick(() => {
        this.updatePosition(el, this.state)
        done()
      })
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
          this.$slots.default
        )
      ] : null
    )
  }
}
</script>

<style scoped>
.kinesin {
  /* default transition property, intended to be overridden */
  transition: transform 0.6s;
}
</style>
