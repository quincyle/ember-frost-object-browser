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
    filters: PropTypes.EmberComponent.isRequired,

    refineByLabel: PropTypes.string
    // State
  },

  getDefaultProps () {
    return {
      refineByLabel: 'Refine by'
    }
  }

  // == Computed Properties ===================================================

  // == Functions =============================================================

  // == Ember Lifecycle Hooks =================================================

  // == DOM Events ============================================================

  // == Actions ===============================================================
})
