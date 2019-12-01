<script>
import Vue from 'vue'

const bus = new Vue() // event bus
const states = {
  IDLE: 'idle',
  FROM: 'from',
  TO: 'to'
}
const defaultAnimate = (el, from, done, setStyle, nextReflow, stringifyTransform) => {
  setStyle(style => ({
    ...style,
    transform: stringifyTransform(from)
  }))
  nextReflow(() => {
    setStyle({})
    const onTransitionEnd = e => {
      if (e.target === el) {
        el.removeEventListener('transitionend', onTransitionEnd)
        done()
      }
    }
    el.addEventListener('transitionend', onTransitionEnd)
  })
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
    },
    animate: {
      type: Function,
      default: defaultAnimate
    }
  },
  data () {
    return {
      from: null,
      shouldRender: false,
      state: states.IDLE,
      style: {}
    }
  },
  computed: {
    baseClass () {
      return `kinesin-${this.name} kinesin`
    },
    class () {
      const kinesinActive = 'kinesin-active'
      if (this.state === states.FROM) {
        return [this.baseClass, kinesinActive, 'kinesin-from']
      }
      if (this.state === states.TO) {
        return [this.baseClass, kinesinActive, 'kinesin-to']
      }
      return this.baseClass
    },
    eventName () {
      return `_${this.group}_${this.name}`
    }
  },
  created () {
    bus.$on(this.eventName, this.onFromReceived)
  },
  beforeDestroy () {
    bus.$off(this.eventName, this.onFromReceived)
  },
  methods: {
    getVisualProperties (el) {
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
      const { top, left, width, height } = el.getBoundingClientRect()
      return {
        top,
        left,
        width,
        height
      }
    },
    sendFromState (el, state) {
      bus.$emit(this.eventName, this.getVisualProperties(el), state)
    },
    determineTransform (el) {
      const fromState = this.from
      const thisState = this.getVisualProperties(el)
      const translateX = fromState.left - thisState.left
      const translateY = fromState.top - thisState.top
      if (this.transitionSize) {
        const xScaleOffset = (fromState.width - thisState.width) / 2
        const yScaleOffset = (fromState.height - thisState.height) / 2
        const translation = {
          translateX: translateX + xScaleOffset,
          translateY: translateY + yScaleOffset
        }
        const scale = {
          scaleX: fromState.width / thisState.width,
          scaleY: fromState.height / thisState.height
        }
        return {
          ...translation,
          ...scale
        }
      }
      return {
        translateX,
        translateY
      }
    },
    nextReflow (callback) {
      // wait for DOM update
      const promise = this.$nextTick()
        .then(() => {
          // force document reflow
          // assign to this to avoid being removed in tree-shaking
          this._reflow = document.body.offsetHeight
          callback && callback()
        })
      if (!callback) {
        return promise
      }
    },
    stringifyTransform ({ translateX, translateY, scaleX, scaleY }) {
      const translation = `translate3d(${translateX}px, ${translateY}px, 0px)`
      if (this.transitionSize) {
        return `${translation} scale(${scaleX}, ${scaleY})`
      }
      return translation
    },
    onFromReceived (pos, state) {
      this.shouldRender = true
      this.from = pos
      this.state = state
    },
    setStyle (arg) {
      if (typeof arg === 'function') {
        this.style = arg(this.style)
        return
      }
      this.style = arg
    },
    enter (el, done) {
      if (!this.from) {
        return done()
      }
      const onEnd = () => {
        this.state = states.IDLE
        this.style = {}
        this.$emit('transitionend')
        done()
      }
      if (this.state === states.IDLE) {
        this.state = states.FROM
      }
      this.style = {
        // no transition
        transition: 'transform 0s ease 0s'
      }
      this.animate(
        el,
        this.determineTransform(el),
        onEnd,
        this.setStyle,
        this.nextReflow,
        this.stringifyTransform
      )
      this.nextReflow(() => {
        this.state = states.TO
        this.$emit('transitionstart')
      })
    },
    leave (el, done) {
      this.$nextTick(() => {
        this.sendFromState(el, this.state)
        done()
      })
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.shouldRender = true
    })
  },
  watch: {
    shouldRender (shouldRender) {
      this.$nextTick(() => {
        this.$emit('render', shouldRender)
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
      this.shouldRender ? [
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
