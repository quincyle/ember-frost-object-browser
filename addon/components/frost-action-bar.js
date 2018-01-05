/**
 * Component definition for the frost-action-bar component
 */

import Ember from 'ember'
import computed, {readOnly} from 'ember-computed-decorators'
import {Component} from 'ember-frost-core'
import {PropTypes} from 'ember-prop-types'
import layout from '../templates/components/frost-action-bar'
import {applicableControls} from '../utils/controls'

const {get, getWithDefault, isEmpty, isPresent, typeOf} = Ember
const MAX_CONTROLS = 4

export default Component.extend({

  // == Dependencies ==========================================================

  // == Keyword Properties ====================================================

  layout,

  // == PropTypes =============================================================

  propTypes: {
    // options
    controls: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.EmberComponent).isRequired,
      PropTypes.object.isRequired
    ]),
    // FIXME: for next major release, make this `i18n.messages.selectedItems()` (@job13er 2017-06-06)
    i18n: PropTypes.shape({
      formatSelectedItemsLabel: PropTypes.func.isRequired
    }),
    moreActionButtons: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.bool,
      PropTypes.object
    ]),
    moreActionButtonsText: PropTypes.string,
    selectedItems: PropTypes.arrayOf(PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ])).isRequired,
    itemTypeKey: PropTypes.string,
    componentKeyNamesForTypes: PropTypes.oneOfType([
      PropTypes.EmberObject,
      PropTypes.object
    ]),
    isLoading: PropTypes.bool,
    isVisible: PropTypes.bool,

    // callbacks
    getSelectedItemsLabel: PropTypes.func

    // state
  },

  getDefaultProps () {
    return {
      // options
      i18n: {
        formatSelectedItemsLabel (count) {
          const items = (count > 1) ? 'Items' : 'Item'
          return `${count} ${items} selected`
        }
      },
      isLoading: false,

      @readOnly
      @computed('selectedItems.[]')
      // computed prop defined here so we have the option of forcing visibility state
      // or computing it based on something else
      isVisible (selectedItems) {
        return !isEmpty(selectedItems)
      },

      moreActionButtons: true,
      moreActionButtonsText: 'More...'

      // callbacks

      // state
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('selectedItems.[]')
  selectedItemsLabel (selectedItems) {
    return this.i18n.formatSelectedItemsLabel(selectedItems.length)
  },

  @readOnly
  @computed('controls', 'selectedItems.[]', 'moreActionButtons')
  /**
   * gets controls for the action bar
   * @param {array|object} controls - array or hash of controls
   * @param {array} selectedItems - array of selected items for filtering controls
   * @param {boolean|object|array} moreActionButtons - array or hash of extra controls
   *  or flag indicating whether to generate them automaticaly
   * @returns {array} array of controls
   */
  _controls (controls, selectedItems, moreActionButtons) {
    controls = this.getNormalizedControls(controls, selectedItems)

    // slice off extra buttons if needed (default)
    if (moreActionButtons === true) {
      let buttonCount = controls.filter(control => control.name !== 'frost-button').length

      // reverse to take buttons off the end
      controls = controls.reverse()
        .filter(control => control.name !== 'frost-button' || ++buttonCount <= MAX_CONTROLS)
      controls.reverse()
    }

    return controls
  },

  @readOnly
  @computed('controls', 'selectedItems.[]', 'moreActionButtons')
  /**
   * gets array of argument sets for building moreActionButtons button
   * @param {array|object} controls - array or hash of controls
   * @param {array} selectedItems - array of selected items for filtering controls
   * @param {boolean|object|array} moreActionButtons - array or hash of extra controls
   *  or flag indicating whether to generate them automaticaly
   * @returns {array} array for building moreActionButtons button
   */
  _moreActionButtons (controls, selectedItems, moreActionButtons) {
    controls = this.getNormalizedControls(controls, selectedItems)
    moreActionButtons = this.getNormalizedControls(moreActionButtons, selectedItems)

    // fail fast if we're told not use this feature
    if (moreActionButtons === false) {
      return []
    }

    // get the extra buttons if needed (default)
    if (moreActionButtons === true) {
      let buttonCount = controls.filter(control => control.name !== 'frost-button').length

      // reverse to grab buttons from the end
      moreActionButtons = controls.reverse()
        .filter(control => control.name === 'frost-button' && ++buttonCount > MAX_CONTROLS)
      controls.reverse()
    }

    // convert buttons to POJOs if needed
    return moreActionButtons.map(button => button.name === 'frost-button' ? this.convertButton(button) : button)
  },

  // == Functions =============================================================

  /**
   * converts a button to a hash of arguments to be used for building the moreActionButtons button
   * @param {FrostButton} button - a frost-button to convert
   * @returns {object} - plain object of props for moreActionButtons button
   */
  convertButton (button) {
    const propNames = ['disabled', 'hook', 'onClick', 'text']

    return button.args.named.keys.reduce((props, key) => {
      // only get specified prop names
      if (propNames.includes(key)) {
        // compute the disabled property if exists and is needed
        if (key === 'disabled') {
          let disabled = get(button, 'args.named._map.disabled')
          let compute = get(disabled, 'compute')

          // need disabled.compute vs just compute for context
          props[key] = typeof compute === 'function' ? disabled.compute() : disabled

        // else grab value from component
        } else {
          props[key] = get(button, `args.named._map.${key}.inner`)
        }
      }

      return props
    }, {})
  },

  /**
   * converts controls to array if they are given as a hash
   * filters out inapplicable controls
   * @param {object|array} controls - array or hash of controls
   * @param {array} selectedItems - array of selected items for filtering
   * @returns {array} - array of controls
   */
  getNormalizedControls (controls, selectedItems) {
    // convert hash of controls to array if necessary
    // notice this is Ember typeOf, which is very differnt from native typeof
    if (typeOf(controls) === 'object') {
      // filter out inapplicable controls
      controls = applicableControls(this.selectedTypesWithControls(selectedItems)).map((controlName) => {
        return controls[controlName]
      })

    // return copy if array
    } else if (Array.isArray(controls)) {
      return controls.slice(0)
    }

    return controls
  },

  /**
   * filters out inapplicable controls
   * @param {array} selectedItems - currently selected items
   * @returns {array} - array of applicable controls
   */
  selectedTypesWithControls (selectedItems) {
    const componentKeyNamesForTypes = this.get('componentKeyNamesForTypes')
    const itemTypeKey = this.get('itemTypeKey')
    const componentKeyNames = this.get('componentKeyNames')

    if (isPresent(componentKeyNamesForTypes) && isPresent(itemTypeKey)) {
      return selectedItems.reduce((typesWithControls, item) => {
        const itemType = get(item, itemTypeKey)
        if (itemType) {
          const itemTypeContent = getWithDefault(componentKeyNamesForTypes, itemType, {})
          const itemTypeContentControls = getWithDefault(itemTypeContent, get(componentKeyNames, 'controls'), [])
          typesWithControls[itemType] = itemTypeContentControls
        }
        return typesWithControls
      }, {})
    }
  }

  // == DOM Events ============================================================

  // == Lifecycle Hooks =======================================================

  // == Actions ===============================================================

})
