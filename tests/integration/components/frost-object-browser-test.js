/**
 * Integration test for the frost-object-browser component
 */

import {expect} from 'chai'
import {registerMockComponent, unregisterMockComponent} from 'ember-test-utils/test-support/mock-component'
import {integration} from 'ember-test-utils/test-support/setup-component-test'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'

const test = integration('frost-object-browser')
describe(test.label, function () {
  test.setup()

  beforeEach(function () {
    registerMockComponent(this, 'mock-content')
    registerMockComponent(this, 'mock-controls')
    registerMockComponent(this, 'mock-filters')
    this.setProperties({
      myHook: 'myObjectBrowser'
    })
  })

  afterEach(function () {
    unregisterMockComponent(this, 'mock-content')
    unregisterMockComponent(this, 'mock-controls')
    unregisterMockComponent(this, 'mock-filters')
  })

  describe('after render', function () {
    beforeEach(function () {
      this.render(hbs`
        {{frost-object-browser
          hook=myHook
          hookQualifiers=(hash)
          content=(component 'mock-content' class='mock-content')
          controls=(component 'mock-controls' class='mock-controls')
          filters=(component 'mock-filters' class='mock-filters')
        }}
      `)
    })

    it('should render a component passed into the "content" property', function () {
      expect(this.$('.mock-content')).to.have.length(1)
    })

    it('should render a component passed into the "controls" property', function () {
      expect(this.$('.mock-controls')).to.have.length(1)
    })

    it('should render a component passed into the "filters" property', function () {
      expect(this.$('.mock-filters')).to.have.length(1)
    })

    it('should render the refine by label in the facets', function () {
      expect(this.$('.frost-object-browser-facets-header')).to.have.text('Refine by')
    })
  })

  describe('after render, when given a new refineByLabel', function () {
    beforeEach(function () {
      this.render(hbs`
        {{frost-object-browser
          hook=myHook
          hookQualifiers=(hash)
          content=(component 'mock-content' class='mock-content')
          controls=(component 'mock-controls' class='mock-controls')
          filters=(component 'mock-filters' class='mock-filters')
          refineByLabel='Filtrar por'
        }}
      `)
    })

    it('should render a component passed into the "content" property', function () {
      expect(this.$('.mock-content')).to.have.length(1)
    })

    it('should render a component passed into the "controls" property', function () {
      expect(this.$('.mock-controls')).to.have.length(1)
    })

    it('should render a component passed into the "filters" property', function () {
      expect(this.$('.mock-filters')).to.have.length(1)
    })

    it('should render the refine by label in the facets', function () {
      expect(this.$('.frost-object-browser-facets-header')).to.have.text('Filtrar por')
    })
  })
})
