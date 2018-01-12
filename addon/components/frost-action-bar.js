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
    alwaysVisible: PropTypes.bool,

    // callbacks
    getSelectedItemsLabel: PropTypes.func

    // state
  },

  getDefaultProps () {
    return {
      // options
      alwaysVisible: false,
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
    return this.get('alwaysVisible') || !isEmpty(selectedItems)
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

    // slice off extra controls if needed (default)
    if (moreActions === true) {
      // get count of components that have onClick defined
      let clickableCount = controls.filter(control => !this.hasOnClick(control)).length

      // remove controls from the beginning of array when we have more than 4
      // only remove controls with onClick defined
      // also ignore invisible controls
      controls = controls.reverse()
        .filter(control => !this.hasOnClick(control) ||
           !this.controlIsVisible(control) ||
           ++clickableCount <= MAX_CONTROLS)
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

    // get the extra controls if needed (default)
    if (moreActions === true) {
      // get count of components that have onClick defined
      let clickableCount = controls.filter(control => !this.hasOnClick(control)).length

      // grab controls from beginning for moreACtions button if we have more than 4
      // only grab controls which have onClick defined
      // ignore invisible controls
      moreActions = controls.reverse()
        .filter(control => this.controlIsVisible(control) &&
          this.hasOnClick(control) &&
          ++clickableCount > MAX_CONTROLS)
      moreActions.reverse()
    }

    // convert controls to POJOs if needed
    return moreActions.map(control => this.convertControl(control))
  },

  // == Functions =============================================================

  controlIsVisible (control) {
    return this.convertControl(control).isVisible !== false
  },

  /**
   * converts a control to a hash of arguments to be used for building the moreActions button
   * @param {Ember.Component|object} control - a control to convert
   * @returns {object} - plain object of props for moreActions button
   */
  convertControl (control) {
    const propNames = ['disabled', 'isVisible', 'hook', 'onClick', 'text']
    let hashKey = Object.keys(control).filter(key => /component_hash/i.test(key))
    let result

    // ember 2.8
    // TODO remove when we stop supporting Ember 2.8
    // Ember 2.8 handled the internals of the passed component definition differently
    if (hashKey.length) {
      hashKey = hashKey[0]

      const hash = control[hashKey]

      result = propNames.reduce((props, key) => {
        let val = hash[key]

        // compute if necessary
        if (typeof val === 'object' && val._compute && typeof val._compute === 'function') {
          val = val._compute()
        }

        // set val
        props[key] = val

        // return the props
        return props
      }, {})

    // ember 2.12+
    } else if (get(control, 'args.named.keys')) {
      result = control.args.named.keys.reduce((props, key) => {
        // only get specified prop names
        if (propNames.includes(key)) {
          // compute the property if exists and is needed
          let val = get(control, `args.named._map.${key}`)

          if (val.compute || val._lastValue) {
            let lastVal = val._lastValue

            // use lastVal
            if (lastVal !== undefined && lastVal !== null) {
              props[key] = lastVal
            } else {
              // need val.compute vs just compute for context
              props[key] = val.compute()
            }

          // else grab value from component
          } else {
            props[key] = get(control, `args.named._map.${key}.inner`)
          }
        }

        return props
      }, {})

    // POJO
    } else {
      result = control
    }

    // set classNames
    result.classNames = [
      result.disabled ? 'disabled' : '',
      !result.isVisible ? 'invisible' : ''
    ].filter(prop => !!prop).join(' ')

    return result
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
   * checks whether a component definition has an onClick handler
   * @param {Ember.Component|object} control - control to check whether has onClick
   * @returns {boolean} whether the control does indeed have an onClick
   */
  hasOnClick (control) {
    if (control.onClick || this.convertControl(control).onClick) {
      return true
    }
    return false
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
