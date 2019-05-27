<script>
const noTransition = 'all 0s ease 0s'
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
    },
    animateTag: {
      type: String,
      default: 'div'
    }
  },
  data () {
    return {
      from: null
    }
  },
  computed: {
    className () {
      return 'kinesin-' + this.id
    }
  },
  methods: {
    enter (el, done) {
      window.requestAnimationFrame(() => {
        this.from = this.getFrom()
        if (this.from) {
          el.style.transition = noTransition
          el.style.transform = this.translateRelativeOffset(el)
          el.className = `${this.className} kinesin-active kinesin-from`
          this.$emit('transitionstart')
          window.requestAnimationFrame(() => {
            el.style.transition = null
            el.style.transform = null
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
          })
        }
      })
    },
    leave (el, done) {
      window.requestAnimationFrame(() => {
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
