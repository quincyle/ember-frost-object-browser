/**
 * Integration test for the frost-object-browser component
 */

import {expect} from 'chai'
import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'
import {registerMockComponent, unregisterMockComponent} from '../../helpers/mock-component'

import {integration} from 'dummy/tests/helpers/ember-test-utils/setup-component-test'

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

    this.render(hbs`
      {{frost-object-browser
        hook=myHook
        content=(component 'mock-content' class='mock-content')
        controls=(component 'mock-controls' class='mock-controls')
        filters=(component 'mock-filters' class='mock-filters')
      }}
    `)
  })

  afterEach(function () {
    unregisterMockComponent(this)
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
})
