import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-object-browser'

export default Component.extend({
  // == Dependencies ==========================================================
  layout,
  // == Properties ============================================================
  propTypes: {
    // Options
    content: PropTypes.EmberComponent.isRequired,
    controls: PropTypes.EmberComponent.isRequired,
    hook: PropTypes.string.isRequired,
    filters: PropTypes.EmberComponent.isRequired
    // State
  },

  getDefaultProps () {
    return {}
  }

  // == Computed Properties ===================================================

  // == Functions =============================================================

  // == Ember Lifecycle Hooks =================================================

  // == DOM Events ============================================================

  // == Actions ===============================================================
})
