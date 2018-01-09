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
    moreActions: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.EmberComponent),
      PropTypes.arrayOf(PropTypes.object),
      PropTypes.bool,
      PropTypes.object
    ]),
    moreActionsText: PropTypes.string,
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
    forceVisible: PropTypes.bool,

    // callbacks
    getSelectedItemsLabel: PropTypes.func

    // state
  },

  getDefaultProps () {
    return {
      // options
      forceVisible: false,
      i18n: {
        formatSelectedItemsLabel (count) {
          const items = (count > 1) ? 'Items' : 'Item'
          return `${count} ${items} selected`
        }
      },
      isLoading: false,

      moreActions: true,
      moreActionsText: 'More...'

      // callbacks

      // state
    }
  },

  // == Computed Properties ===================================================

  @readOnly
  @computed('selectedItems.[]')
  isVisible (selectedItems) {
    return this.get('forceVisible') || !isEmpty(selectedItems)
  },

  @readOnly
  @computed('selectedItems.[]')
  selectedItemsLabel (selectedItems) {
    return this.i18n.formatSelectedItemsLabel(selectedItems.length)
  },

  @readOnly
  @computed('controls', 'selectedItems.[]', 'moreActions')
  /**
   * gets controls for the action bar
   * @param {Ember.Component[]|object} controls - array or hash of controls
   * @param {Ember.Object[]|object[]} selectedItems - array of selected items for filtering controls
   * @param {Ember.Component[]|boolean|object[]|object} moreActions - array or hash of extra controls
   *  or flag indicating whether to generate them automatically
   * @returns {Ember.Component[]} array of controls
   */
  _controls (controls, selectedItems, moreActions) {
    controls = this.getNormalizedControls(controls, selectedItems)

    // slice off extra buttons if needed (default)
    if (moreActions === true) {
      let buttonCount = controls.filter(control => !this.isFrostButton(control)).length

      // reverse to take buttons off the end
      controls = controls.reverse()
        .filter(control => !this.isFrostButton(control) || ++buttonCount <= MAX_CONTROLS)
      controls.reverse()
    }

    return controls
  },

  @readOnly
  @computed('controls', 'selectedItems.[]', 'moreActions')
  /**
   * gets controls for the action bar
   * @param {Ember.Component[]|object} controls - array or hash of moreActions
   * @param {Ember.Object[]|object[]} selectedItems - array of selected items for filtering moreActions
   * @param {Ember.Component[]|boolean|object[]|object} moreActions - array or hash of extra moreActions
   *  or flag indicating whether to generate them automatically
   * @returns {object[]} array of moreActions definitions
   */
  _moreActions (controls, selectedItems, moreActions) {
    controls = this.getNormalizedControls(controls, selectedItems)
    moreActions = this.getNormalizedControls(moreActions, selectedItems)

    // fail fast if we're told not use this feature
    if (moreActions === false) {
      return []
    }

    // get the extra buttons if needed (default)
    if (moreActions === true) {
      let buttonCount = controls.filter(control => !this.isFrostButton(control)).length

      // reverse to grab buttons from the end
      moreActions = controls.reverse()
        .filter(control => this.isFrostButton(control) && ++buttonCount > MAX_CONTROLS)
      moreActions.reverse()

    }

    // convert buttons to POJOs if needed
    return moreActions.map(button => this.isFrostButton(button) ? this.convertButton(button) : button)
  },

  // == Functions =============================================================

  /**
   * converts a button to a hash of arguments to be used for building the moreActions button
   * @param {FrostButton} button - a frost-button to convert
   * @returns {object} - plain object of props for moreActions button
   */
  convertButton (button) {
    const propNames = ['disabled', 'hook', 'onClick', 'text']

    // ember 2.12+
    if (button.args) {
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
    // ember 2.8
    } else {
      let hashKey = Object.keys(button).filter(key => /hash/i.test(key))

      if (hashKey.length) {
        hashKey = hashKey[0]
      } else {
        return button
      }

      const hash = button[hashKey]

      return propNames.reduce((props, key) => {
        let val = hash[key]

        // compute if necessary
        if (typeof(val) === 'object' && val._compute && typeof(val._compute) === 'function') {
          val = val._compute()
        }

        // set val
        props[key] = val

        // return the props
        return props
      }, {})
    }
  },

  /**
   * converts controls to array if they are given as a hash
   * filters out inapplicable controls
   * @param {Ember.Component[]|boolean|object[]|object} controls - array or hash of controls
   * @param {Ember.Object[]|object[]} selectedItems - array of selected items
   * @returns {Ember.Component[]|boolean|object[]} - array of controls or flag
   */
  getNormalizedControls (controls, selectedItems) {
    // convert hash of controls to array if necessary
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
   * checks whether a given component is a frost-buttons
   * @param {Ember.Component|object} component - component to check
   * @returns {boolean} - whether component is a frost-button
   */
  isFrostButton(component) {
    return Object.values(component).includes('frost-button')
  },

  /**
   * filters out inapplicable controls
   * @param {Ember.Object[]|object[]} selectedItems - array of selected items
   * @returns {Ember.Object[]|object[]} - array of applicable controls
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
