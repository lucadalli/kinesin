/* eslint-disable */
import Vue from 'vue';

var bus = new Vue(); // event bus
var states = {
  IDLE: 'idle',
  FROM: 'from',
  TO: 'to'
};
var defaultAnimate = function (el, from, done, setStyle, nextReflow, stringifyTransform) {
  setStyle(function (style) { return (Object.assign({}, style,
    {transform: stringifyTransform(from)})); });
  nextReflow(function () {
    setStyle({});
    var onTransitionEnd = function (e) {
      if (e.target === el) {
        el.removeEventListener('transitionend', onTransitionEnd);
        done();
      }
    };
    el.addEventListener('transitionend', onTransitionEnd);
  });
};

var script = {
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
  data: function data () {
    return {
      from: null,
      shouldRender: false,
      state: states.IDLE,
      style: {}
    }
  },
  computed: {
    baseClass: function baseClass () {
      return ("kinesin-" + (this.name) + " kinesin")
    },
    class: function class$1 () {
      var kinesinActive = 'kinesin-active';
      if (this.state === states.FROM) {
        return [this.baseClass, kinesinActive, 'kinesin-from']
      }
      if (this.state === states.TO) {
        return [this.baseClass, kinesinActive, 'kinesin-to']
      }
      return this.baseClass
    },
    eventName: function eventName () {
      return ("_" + (this.group) + "_" + (this.name))
    }
  },
  created: function created () {
    bus.$on(this.eventName, this.onFromReceived);
  },
  beforeDestroy: function beforeDestroy () {
    bus.$off(this.eventName, this.onFromReceived);
  },
  methods: {
    getVisualProperties: function getVisualProperties (el) {
      if (this.ignoreCssTransforms) {
        var top$1 = 0;
        var left$1 = 0;
        var element = el;

        // Traverse the DOM tree upwards to find the
        // cumulative offsets without considering CSS transforms
        do {
          top$1 += element.offsetTop || 0;
          left$1 += element.offsetLeft || 0;
          element = element.offsetParent;
        } while (element)

        return {
          top: top$1,
          left: left$1,
          width: el.offsetWidth,
          height: el.offsetHeight
        }
      }
      var ref = el.getBoundingClientRect();
      var top = ref.top;
      var left = ref.left;
      var width = ref.width;
      var height = ref.height;
      return {
        top: top,
        left: left,
        width: width,
        height: height
      }
    },
    sendFromState: function sendFromState (el, state) {
      bus.$emit(this.eventName, this.getVisualProperties(el), state);
    },
    determineTransform: function determineTransform (el) {
      var fromState = this.from;
      var thisState = this.getVisualProperties(el);
      var translateX = fromState.left - thisState.left;
      var translateY = fromState.top - thisState.top;
      if (this.transitionSize) {
        var xScaleOffset = (fromState.width - thisState.width) / 2;
        var yScaleOffset = (fromState.height - thisState.height) / 2;
        var translation = {
          translateX: translateX + xScaleOffset,
          translateY: translateY + yScaleOffset
        };
        var scale = {
          scaleX: fromState.width / thisState.width,
          scaleY: fromState.height / thisState.height
        };
        return Object.assign({}, translation,
          scale)
      }
      return {
        translateX: translateX,
        translateY: translateY
      }
    },
    nextReflow: function nextReflow (callback) {
      var this$1 = this;

      // wait for DOM update
      var promise = this.$nextTick()
        .then(function () {
          // force document reflow
          // assign to this to avoid being removed in tree-shaking
          this$1._reflow = document.body.offsetHeight;
          callback && callback();
        });
      if (!callback) {
        return promise
      }
    },
    stringifyTransform: function stringifyTransform (ref) {
      var translateX = ref.translateX;
      var translateY = ref.translateY;
      var scaleX = ref.scaleX;
      var scaleY = ref.scaleY;

      var translation = "translate3d(" + translateX + "px, " + translateY + "px, 0px)";
      if (this.transitionSize) {
        return (translation + " scale(" + scaleX + ", " + scaleY + ")")
      }
      return translation
    },
    onFromReceived: function onFromReceived (pos, state) {
      this.shouldRender = true;
      this.from = pos;
      this.state = state;
    },
    setStyle: function setStyle (arg) {
      if (typeof arg === 'function') {
        this.style = arg(this.style);
        return
      }
      this.style = arg;
    },
    enter: function enter (el, done) {
      var this$1 = this;

      if (!this.from) {
        return done()
      }
      var onEnd = function () {
        this$1.state = states.IDLE;
        this$1.style = {};
        this$1.$emit('transitionend');
        done();
      };
      if (this.state === states.IDLE) {
        this.state = states.FROM;
      }
      this.style = {
        // no transition
        transition: 'transform 0s ease 0s'
      };
      this.animate(
        el,
        this.determineTransform(el),
        onEnd,
        this.setStyle,
        this.nextReflow,
        this.stringifyTransform
      );
      this.nextReflow(function () {
        this$1.state = states.TO;
        this$1.$emit('transitionstart');
      });
    },
    leave: function leave (el, done) {
      var this$1 = this;

      this.$nextTick(function () {
        this$1.sendFromState(el, this$1.state);
        done();
      });
    }
  },
  mounted: function mounted () {
    var this$1 = this;

    this.$nextTick(function () {
      this$1.shouldRender = true;
    });
  },
  watch: {
    shouldRender: function shouldRender (shouldRender$1) {
      var this$1 = this;

      this.$nextTick(function () {
        this$1.$emit('render', shouldRender$1);
      });
    }
  },
  render: function render (h) {
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
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier /* server only */, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    if (typeof shadowMode !== 'boolean') {
        createInjectorSSR = createInjector;
        createInjector = shadowMode;
        shadowMode = false;
    }
    // Vue.extend constructor export interop.
    var options = typeof script === 'function' ? script.options : script;
    // render functions
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
        // functional template
        if (isFunctionalTemplate) {
            options.functional = true;
        }
    }
    // scopedId
    if (scopeId) {
        options._scopeId = scopeId;
    }
    var hook;
    if (moduleIdentifier) {
        // server build
        hook = function (context) {
            // 2.3 injection
            context =
                context || // cached call
                    (this.$vnode && this.$vnode.ssrContext) || // stateful
                    (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
            // 2.2 with runInNewContext: true
            if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
                context = __VUE_SSR_CONTEXT__;
            }
            // inject component styles
            if (style) {
                style.call(this, createInjectorSSR(context));
            }
            // register component module identifier for async chunk inference
            if (context && context._registeredComponents) {
                context._registeredComponents.add(moduleIdentifier);
            }
        };
        // used by ssr in case component is cached and beforeCreate
        // never gets called
        options._ssrRegister = hook;
    }
    else if (style) {
        hook = shadowMode
            ? function (context) {
                style.call(this, createInjectorShadow(context, this.$root.$options.shadowRoot));
            }
            : function (context) {
                style.call(this, createInjector(context));
            };
    }
    if (hook) {
        if (options.functional) {
            // register for functional component in vue file
            var originalRender = options.render;
            options.render = function renderWithStyleInjection(h, context) {
                hook.call(context);
                return originalRender(h, context);
            };
        }
        else {
            // inject component registration as beforeCreate hook
            var existing = options.beforeCreate;
            options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
        }
    }
    return script;
}

var isOldIE = typeof navigator !== 'undefined' &&
    /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
    return function (id, style) { return addStyle(id, style); };
}
var HEAD;
var styles = {};
function addStyle(id, css) {
    var group = isOldIE ? css.media || 'default' : id;
    var style = styles[group] || (styles[group] = { ids: new Set(), styles: [] });
    if (!style.ids.has(id)) {
        style.ids.add(id);
        var code = css.source;
        if (css.map) {
            // https://developer.chrome.com/devtools/docs/javascript-debugging
            // this makes source maps inside style tags work properly in Chrome
            code += '\n/*# sourceURL=' + css.map.sources[0] + ' */';
            // http://stackoverflow.com/a/26603875
            code +=
                '\n/*# sourceMappingURL=data:application/json;base64,' +
                    btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) +
                    ' */';
        }
        if (!style.element) {
            style.element = document.createElement('style');
            style.element.type = 'text/css';
            if (css.media)
                { style.element.setAttribute('media', css.media); }
            if (HEAD === undefined) {
                HEAD = document.head || document.getElementsByTagName('head')[0];
            }
            HEAD.appendChild(style.element);
        }
        if ('styleSheet' in style.element) {
            style.styles.push(code);
            style.element.styleSheet.cssText = style.styles
                .filter(Boolean)
                .join('\n');
        }
        else {
            var index = style.ids.size - 1;
            var textNode = document.createTextNode(code);
            var nodes = style.element.childNodes;
            if (nodes[index])
                { style.element.removeChild(nodes[index]); }
            if (nodes.length)
                { style.element.insertBefore(textNode, nodes[index]); }
            else
                { style.element.appendChild(textNode); }
        }
    }
}

/* script */
var __vue_script__ = script;

/* template */

  /* style */
  var __vue_inject_styles__ = function (inject) {
    if (!inject) { return }
    inject("data-v-96c3c0a2_0", { source: ".kinesin[data-v-96c3c0a2]{transition:transform .6s}", map: undefined, media: undefined });

  };
  /* scoped */
  var __vue_scope_id__ = "data-v-96c3c0a2";
  /* module identifier */
  var __vue_module_identifier__ = undefined;
  /* functional template */
  var __vue_is_functional_template__ = undefined;
  /* style inject SSR */
  
  /* style inject shadow dom */
  

  
  var __vue_component__ = normalizeComponent(
    {},
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    false,
    createInjector,
    undefined,
    undefined
  );

export default __vue_component__;
