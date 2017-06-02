/**
 * Integration test for the frost-action-bar component
 */

import {expect} from 'chai'
import wait from 'ember-test-helpers/wait'
import {registerMockComponent, unregisterMockComponent} from 'ember-test-utils/test-support/mock-component'
import {integration} from 'ember-test-utils/test-support/setup-component-test'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import sinon from 'sinon'

const test = integration('frost-action-bar')
describe(test.label, function () {
  test.setup()

  let sandbox

  beforeEach(function () {
    sandbox = sinon.sandbox.create()
    registerMockComponent(this, 'mock-controls')
    this.set('selectedItems', [])
  })

  afterEach(function () {
    sandbox.restore()
    unregisterMockComponent(this, 'mock-controls')
  })

  describe('after render', function () {
    beforeEach(function () {
      this.render(hbs`
        {{frost-action-bar
          controls=(array (component 'mock-controls' class='mock-controls'))
          hook='bar'
          hookQualifiers=(hash)
          selectedItems=selectedItems
        }}
      `)
    })

    it('should render a component passed into the "controls" property', function () {
      expect(this.$('.mock-controls')).to.have.length(1)
    })

    it('should be hidden in the DOM until selectedItems[] has elements', function () {
      expect(this.$('.frost-action-bar')).to.have.css('display', 'none')
    })

    describe('when selectedItems is not empty', function () {
      beforeEach(function () {
        this.set('selectedItems', [{}])
      })

      it('should list the number of selected items', function () {
        expect(this.$('.frost-action-bar-selections')).to.have.text('1 Item selected')
      })
    })

    describe('when more than one item is selected', function () {
      beforeEach(function () {
        this.set('selectedItems', [{}, {}])
      })

      it('should list the number of selected items', function () {
        expect(this.$('.frost-action-bar-selections')).to.have.text('2 Items selected')
      })
    })
  })

  describe('after render with a custom getSelectedItemsLabel()', function () {
    let formatSelectedItemsLabel, selectedItems
    beforeEach(function () {
      formatSelectedItemsLabel = sandbox.stub().returns('foo-bar')
      selectedItems = [{}, {}, {}]
      this.setProperties({
        formatSelectedItemsLabel,
        selectedItems
      })

      this.render(hbs`
        {{frost-action-bar
          controls=(array (component 'mock-controls' class='mock-controls'))
          hook='bar'
          hookQualifiers=(hash)
          i18n=(hash
            formatSelectedItemsLabel=formatSelectedItemsLabel
          )
          selectedItems=selectedItems
        }}
      `)
    })

    it('should call the provided method to generate the label', function () {
      expect(formatSelectedItemsLabel).to.have.been.calledWith(3)
    })

    it('should render the returned label', function () {
      expect(this.$('.frost-action-bar-selections')).to.have.text('foo-bar')
    })

    describe('when another item is selected', function () {
      beforeEach(function () {
        formatSelectedItemsLabel.withArgs(4).returns('fizz-bang')
        this.set('selectedItems', [{}, {}, {}, {}])
        return wait()
      })

      it('should re-calcualte the label', function () {
        expect(formatSelectedItemsLabel).to.have.been.calledWith(4)
      })

      it('should render the returned label', function () {
        expect(this.$('.frost-action-bar-selections')).to.have.text('fizz-bang')
      })
    })
  })
})
