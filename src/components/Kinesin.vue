<script>
const defaultGroup = 'default'
const instances = {
  [defaultGroup]: {}
}

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
      from: null,
      classes: [],
      style: {}
    }
  },
  methods: {
    enter (el, done) {
      this.$nextTick(() => { // wait for 'from' instance to update position in leave hook
        this.from = this.getFrom()
        if (this.from) {
          this.classes = ['kinesin-active', 'kinesin-from']
          this.style = {
            transform: this.translateRelativeOffset(el),
            transition: 'none'
          }
          this.$nextTick(() => { // wait for next DOM update
            window.requestAnimationFrame(() => { // wait for next repaint
              this.style = {
                transform: 'none'
              }
              this.classes = ['kinesin-active', 'kinesin-to']
              this.$el.addEventListener('transitionend', () => {
                this.classes = []
                this.style = {}
                this.$emit('transitionend')
                done()
              }, { once: true })
            })
          })
        }
      })
    },
    leave (el, done) {
      this.$nextTick(() => {
        setTimeout(() => {
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