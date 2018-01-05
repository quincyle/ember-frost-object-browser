/**
 * Integration test for the frost-action-bar component
 */

import {expect} from 'chai'
import {$hook, initialize as initializeHook} from 'ember-hook'
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
    initializeHook()
    sandbox = sinon.sandbox.create()
    registerMockComponent(this, 'mock-controls')
    registerMockComponent(this, 'frost-button')
    this.set('selectedItems', [])
  })

  afterEach(function () {
    sandbox.restore()
    unregisterMockComponent(this, 'mock-controls')
    unregisterMockComponent(this, 'frost-button')
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

  describe('after render with controls as a hash', function () {
    let formatSelectedItemsLabel, selectedItems

    beforeEach(function () {
      formatSelectedItemsLabel = sandbox.stub()
      selectedItems = [
        {id: 1, itemType: 'a'},
        {id: 2, itemType: 'b'}
      ]

      this.setProperties({
        itemTypeKey: 'itemType',
        componentKeyNames: {
          controls: 'controlNames'
        },
        componentKeyNamesForTypes: {
          a: {
            controlNames: [
              'action1'
            ]
          },
          b: {
            controlNames: [
              'action1',
              'action2'
            ]
          }
        },
        formatSelectedItemsLabel: formatSelectedItemsLabel,
        selectedItems: selectedItems
      })

      this.render(hbs`
        {{frost-action-bar
          hook='bar'
          hookQualifiers=(hash)
          itemTypeKey=itemTypeKey
          componentKeyNames=componentKeyNames
          componentKeyNamesForTypes=componentKeyNamesForTypes
          controls=(hash
            action1=(component 'mock-controls' class='mock-control-1')
            action2=(component 'mock-controls' class='mock-control-2')
          )
          i18n=(hash
            formatSelectedItemsLabel=formatSelectedItemsLabel
          )
          selectedItems=selectedItems
        }}
        `)
    })

    it('should render with the applicable controls', function () {
      expect(this.$('.frost-action-bar-buttons .mock-control-1')).to.have.length(1)
    })

    it('should not render the inapplicable controls', function () {
      expect(this.$('.frost-action-bar-buttons .mock-control-2')).to.have.length(0)
    })
  })

  describe('after render with loading options provided', function () {
    beforeEach(function () {
      this.setProperties({
        isLoading: true,
        loadingText: 'Loading actions'
      })

      this.render(hbs`
        {{frost-action-bar
          controls=(array (component 'mock-controls' class='mock-controls'))
          hook='frost-action-bar'
          hookQualifiers=(hash)
          isLoading=isLoading
          loadingText=loadingText
          selectedItems=selectedItems
        }}
      `)
    })

    it('should render with a loading animation', function () {
      expect(this.$('.frost-action-bar-loading')).to.have.length(1)
    })

    it('should render with the provided loading text', function () {
      expect(this.$('.frost-action-bar-loading .loading-text').text()).to.equal('Loading actions')
    })
  })

  describe('moreActionButtons', function () {
    describe('default', function () {
      let buttonAction

      beforeEach(function () {
        buttonAction = sinon.spy()
        this.set('buttonAction', buttonAction)

        this.render(hbs`
          {{frost-action-bar
            controls=(array
              (component 'mock-controls' class="control mock-controls" text='link')
              (component 'frost-button' class="control test-button" text='button 1' onClick=(action buttonAction))
              (component 'frost-button' class="control test-button" text='button 2')
              (component 'frost-button' class="control test-button" text='button 3')
              (component 'frost-button' class="control test-button" text='button 4')
              (component 'frost-button' class="control test-button" text='button 5')
            )
            hook='bar'
            hookQualifiers=(hash)
            selectedItems=selectedItems
          }}
        `)
      })

      it('should limit controls to 4', function () {
        expect(this.$('.control').length).to.equal(4)
      })

      it('should generate a moreActionButtons button', function () {
        expect($hook('moreActions').length).to.equal(1)
      })

      it('should move the extra buttons to li elements in the moreActions dropdown', function () {
        const $moreButton = $hook('moreActions')
        expect($moreButton.find('li').length).to.equal(2)
      })

      it('should slice buttons off the beginning of the list', function () {
        const $moreButton = $hook('moreActions')
        expect($moreButton.find('li').first().text().trim()).to.equal('button 1')
      })

      it('should pass through button actions', function () {
        const $moreButton = $hook('moreActions')
        $moreButton.find('li').first().click()
        expect(buttonAction).to.have.callCount(1)
      })
    })

    describe('set to false', function () {
      beforeEach(function () {
        this.render(hbs`
          {{frost-action-bar
            moreActionButtons=false
            controls=(array
              (component 'frost-button' class="test-button" text='button 1')
              (component 'frost-button' class="test-button" text='button 2')
              (component 'frost-button' class="test-button" text='button 3')
              (component 'frost-button' class="test-button" text='button 4')
              (component 'frost-button' class="test-button" text='button 5')
            )
            hook='bar'
            hookQualifiers=(hash)
            selectedItems=selectedItems
          }}
        `)
      })

      it('should allow more than 4 buttons', function () {
        expect(this.$('.test-button').length).to.equal(5)
      })

      it('should not generate a "More..." button', function () {
        expect($hook('moreActions').length).to.equal(0)
      })
    })

    describe('passed in template', function () {
      beforeEach(function () {
        this.render(hbs`
          {{frost-action-bar
            controls=(array 
              (component 'frost-button' class="test-button" text='button 1')
              (component 'frost-button' class="test-button" text='button 2')
              (component 'frost-button' class="test-button" text='button 3')
              (component 'frost-button' class="test-button" text='button 4')
              (component 'frost-button' class="test-button" text='button 5')
            )
            moreActionButtons=(array
              (component 'frost-button' class="test-button" text='button 6')
              (component 'frost-button' class="test-button" text='button 7')
              (component 'frost-button' class="test-button" text='button 8')
              (component 'frost-button' class="test-button" text='button 9')
            )
            hook='bar'
            hookQualifiers=(hash)
            selectedItems=selectedItems
          }}
        `)
      })

      it('should put moreActionButtons into moreActionButtons button', function () {
        const $moreButton = $hook('moreActions')
        expect($moreButton.find('li').length).to.equal(4)
      })

      it('should not put any controls into the moreActionButtons', function () {
        // 6 becuase 5 buttons plus 1 more button
        expect($hook('frost-action-bar-buttons').find('dummy').length).to.equal(6)
      })
    })

    describe('passed programmatically', function () {
      let buttonAction

      beforeEach(function () {
        buttonAction = sinon.spy()

        this.set('moreActionButtons', [
          {text: 'button 2', hook: 'button2', onClick: buttonAction},
          {text: 'button 3', hook: 'button3'},
          {text: 'button 4', hook: 'button4'}
        ])

        this.render(hbs`
          {{frost-action-bar
            moreActionButtons=false
            controls=(array
              (component 'frost-button' class="test-button" text='button 1')
            )
            moreActionButtons=moreActionButtons
            hook='bar'
            hookQualifiers=(hash)
            selectedItems=selectedItems
          }}
        `)
      })

      it('should put moreActionButtons in the "More..." button', function () {
        expect($hook('moreActions').find('li').length).to.equal(3)
      })

      it('should pass onClick action', function () {
        $hook('button2').click()
        expect(buttonAction).to.have.callCount(1)
      })
    })
  })
})
