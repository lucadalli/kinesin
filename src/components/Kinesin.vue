<script>
const defaultGroup = 'default'
const instances = {
  [defaultGroup]: {}
}
const noTransition = 'all 0s ease 0s'

const getPosition = el => {
  const rect = el.getBoundingClientRect()
  return {
    top: rect.top + window.pageYOffset,
    left: rect.left + window.pageXOffset
  }
}

export default {
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    group: {
      type: [String, Number],
      default: defaultGroup
    },
    show: {
      type: Boolean,
      required: true
    },
    tag: {
      type: String,
      default: 'div'
    }
  },
  data () {
    return {
      isIE: /MSIE|Trident/.test(window.navigator.userAgent),
      from: null,
      classes: [],
      style: {
        transition: noTransition
      }
    }
  },
  methods: {
    enter (el, done) {
      if (this.isIE) {
        return this.enterTransition(this.$nextTick, el, done)
      }
      return this.enterTransition(this.nextRepaint, el, done)
    },
    enterTransition (deferrer, el, done) {
      deferrer(() => {
        this.from = this.getFrom()
        if (this.from) {
          this.style = {
            transition: noTransition,
            transform: this.translateRelativeOffset(el)
          }
          this.classes = ['kinesin-active', 'kinesin-from']
          this.$emit('transitionstart')
          this.nextRepaint(() => {
            this.style = {}
            this.classes = ['kinesin-active', 'kinesin-to']
            const onTransitionEnd = e => {
              if (e.target === el) {
                el.removeEventListener('transitionend', onTransitionEnd)
                this.classes = []
                this.$emit('transitionend')
                done()
              }
            }
            el.addEventListener('transitionend', onTransitionEnd)
          })
        }
      })
    },
    leave (el, done) {
      this.nextRepaint(() => {
        setTimeout(() => {
          // push to bottom of call stack to ensure that the 'to' instance
          // can grab this instance before it is deleted
          delete instances[this.group][this.id]
          if (Object.keys(instances[this.group]).length === 0) {
            delete instances[this.group]
          }
        }, 0)
      })
      this.updatePosition(el)
      done()
    },
    getFrom () {
      return instances[this.group] && instances[this.group][this.id]
    },
    updatePosition (el) {
      const pos = getPosition(el)
      if (!instances[this.group]) {
        instances[this.group] = {}
      }
      return (instances[this.group][this.id] = pos)
    },
    translateRelativeOffset (el) {
      const fromPos = this.from
      const thisPos = getPosition(el)
      return `translate3d(${fromPos.left - thisPos.left}px, ${fromPos.top - thisPos.top}px, 0)`
    },
    nextRepaint (callback) {
      this.$nextTick(() => { // wait for next DOM update
        window.requestAnimationFrame(() => { // wait for next repaint
          callback()
        })
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
      this.show ? [
        h(this.tag, { style: this.style, class: this.classes }, this.$slots.default)
      ] : null
    )
  }
}
</script>

<style>
  .kinesin-active {
    /* default transition property, intended to be overridden */
    transition: transform 0.6s;
  }
</style>
