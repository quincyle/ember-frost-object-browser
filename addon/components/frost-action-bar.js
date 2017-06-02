/**
 * Component definition for the frost-action-bar component
 */

import Ember from 'ember'
const {isEmpty} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'

import layout from '../templates/components/frost-action-bar'

export default Component.extend({

  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,

  // == PropTypes =============================================================

  propTypes: {
    // options
    controls: PropTypes.arrayOf(PropTypes.EmberComponent).isRequired,
    selectedItems: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ])).isRequired,

    // callbacks
    getSelectedItemsLabel: PropTypes.func

    // state
  },

  getDefaultProps () {
    return {
      // options

      // callbacks
      getSelectedItemsLabel (count) {
        const items = (count > 1) ? 'Items' : 'Item'
        return `${count} ${items} selected`
      }

      // state
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('selectedItems.[]')
  isVisible (selectedItems) {
    return !isEmpty(selectedItems)
  },

  @readOnly
  @computed('selectedItems.[]')
  selectedItemsLabel (selectedItems) {
    return this.getSelectedItemsLabel(selectedItems.length)
  }

  // == Functions =============================================================

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

})
