/**
 * Integration test for the frost-action-bar component
 */

import {expect} from 'chai'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import {registerMockComponent, unregisterMockComponent} from '../../helpers/mock-component'

import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'

const test = integration('frost-action-bar')
describe(test.label, function () {
  test.setup()

  let testObject = Ember.Object.create()
  let selectedTestItems = [
    testObject
  ]

  beforeEach(function () {
    registerMockComponent(this, 'mock-controls')
    this.set('selectedItems', [])

    this.render(hbs`
      {{frost-action-bar
        controls=(array (component 'mock-controls' class='mock-controls'))
        selectedItems=selectedItems
      }}
    `)
  })

  afterEach(function () {
    unregisterMockComponent(this)
  })

  it('should render a component passed into the "controls" property', function () {
    expect(this.$('.mock-controls')).to.have.length(1)
  })

  it('should be hidden in the DOM until selectedItems[] has elements', function () {
    expect(this.$('.frost-action-bar')).to.have.css('display', 'none')
  })

  describe('when selectedItems is not empty', function () {
    beforeEach(function () {
      this.set('selectedItems', selectedTestItems)
    })

    it('should list the number of selected items', function () {
      expect(this.$('.frost-action-bar-selections').text().trim()).to.equal('1 Item selected')
    })
  })
})
