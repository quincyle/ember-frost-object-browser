import {expect} from 'chai'
import {$hook, initialize as initializeHook} from 'ember-hook'
import {registerMockComponent, unregisterMockComponent} from 'ember-test-utils/test-support/mock-component'
import {integration} from 'ember-test-utils/test-support/setup-component-test'

import hbs from 'htmlbars-inline-precompile'
import {afterEach, beforeEach, describe, it} from 'mocha'

const test = integration('frost-object-browser')
describe(test.label, function () {
  test.setup()

  beforeEach(function () {
    initializeHook()
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
      this.set('filterVisible', true)

      this.render(hbs`
        {{frost-object-browser
          hook=myHook
          hookQualifiers=(hash)
          content=(component 'mock-content' class='mock-content')
          controls=(component 'mock-controls' class='mock-controls')
          filters=(component 'mock-filters' class='mock-filters')
          filterVisible=filterVisible
          onFilterVisibleChange=(action (mut filterVisible))
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

    it('with filterVisible=true, should display facets-expanded-view', function () {
      expect($hook('myObjectBrowser-facets-expanded-view').is(':visible')).to.eql(true)
    })

    it('with filterVisible=true, should hide facets-collapsed-view', function () {
      expect($hook('myObjectBrowser-facets-collapsed-view').is(':visible')).to.eql(false)
    })

    describe('when click filter collapse icon', function () {
      beforeEach(function () {
        return $hook('myObjectBrowser-facets-collapse-control').click()
      })

      it('should hide facets-expanded-view', function () {
        expect($hook('myObjectBrowser-facets-expanded-view').is(':visible')).to.eql(false)
      })

      it('should display facets-collapsed-view', function () {
        expect($hook('myObjectBrowser-facets-collapsed-view').is(':visible')).to.eql(true)
      })
    })
  })

  describe('after render, when given a new refineByLabel', function () {
    beforeEach(function () {
      this.set('filterVisible', true)

      this.render(hbs`
        {{frost-object-browser
          hook=myHook
          hookQualifiers=(hash)
          content=(component 'mock-content' class='mock-content')
          controls=(component 'mock-controls' class='mock-controls')
          filters=(component 'mock-filters' class='mock-filters')
          i18n=(hash
            refineByLabel='Filtrar por'
          )
          filterVisible=filterVisible
          onFilterVisibleChange=(action (mut filterVisible))
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

  describe('when rendering with filterVisible=false', function () {
    beforeEach(function () {
      this.set('filterVisible', false)

      this.render(hbs`
        {{frost-object-browser
          hook=myHook
          hookQualifiers=(hash)
          content=(component 'mock-content' class='mock-content')
          controls=(component 'mock-controls' class='mock-controls')
          filters=(component 'mock-filters' class='mock-filters')
          filterVisible=filterVisible
          onFilterVisibleChange=(action (mut filterVisible))
        }}
      `)
    })

    it('should hide facets-expanded-view', function () {
      expect($hook('myObjectBrowser-facets-expanded-view').is(':visible')).to.eql(false)
    })

    it('should display facets-collapsed-view', function () {
      expect($hook('myObjectBrowser-facets-collapsed-view').is(':visible')).to.eql(true)
    })

    describe('when click filter expand icon', function () {
      beforeEach(function () {
        return $hook('myObjectBrowser-facets-expand-control').click()
      })

      it('should display facets-expanded-view', function () {
        expect($hook('myObjectBrowser-facets-expanded-view').is(':visible')).to.eql(true)
      })

      it('should hide facets-collapsed-view', function () {
        expect($hook('myObjectBrowser-facets-collapsed-view').is(':visible')).to.eql(false)
      })
    })
  })
})
