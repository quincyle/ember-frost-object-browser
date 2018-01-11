import {expect} from 'chai'
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import {beforeEach, describe, it} from 'mocha'

const test = unit('frost-action-bar')

describe(test.label, function () {
  test.setup()

  let component, button212, button28, onClick, disabled

  beforeEach(function () {
    onClick = function () { return 'it was clicked' }

    disabled = function () { return false }

    component = this.subject({
      hook: 'test-action-bar',
      selectedItems: []
    })

    button212 = {
      name: 'frost-button',
      args: {
        named: {
          keys: ['hook', 'text', 'disabled', 'onClick'],
          _map: {
            disabled: {compute: function () { return disabled }},
            hook: {inner: 'testHook'},
            onClick: {inner: onClick},
            text: {inner: 'test button'}
          }
        }
      }
    }

    button28 = {
      '__COMPONENT_HASH__ [id=__ember15155339974221008170827489]': {
        disabled: {_compute: function () { return disabled }},
        hook: 'testHook',
        onClick: {_compute: function () { return onClick }},
        text: 'test button'
      },
      '__COMPONENT_PATH__ [id=__ember1515535226912119684704428]': 'frost-button'
    }
  })

  describe('ember 2.12', function () {
    describe('convertControl', function () {
      it('should convert a control to a POJO', function () {
        expect(component.convertControl(button212)).to.eql({
          classNames: 'disabled invisible',
          disabled: disabled,
          hook: 'testHook',
          onClick: onClick,
          text: 'test button'
        })
      })
    })

    describe('hasOnClick', function () {
      it('should return true if component has an onClick property', function () {
        expect(component.hasOnClick(button212)).to.equal(true)
      })

      it('should return false if component does not have an onClick property', function () {
        let button = {hook: 'dummyButton POJO'}

        expect(component.hasOnClick(button)).to.equal(false)
      })
    })
  })

  describe('ember 2.8', function () {
    describe('convertControl', function () {
      it('should convert a button to a POJO', function () {
        expect(component.convertControl(button28)).to.eql({
          classNames: 'disabled invisible',
          disabled: disabled,
          hook: 'testHook',
          isVisible: undefined,
          onClick: onClick,
          text: 'test button'
        })
      })
    })

    describe('hasOnClick', function () {
      it('should return true if component has an onClick property', function () {
        expect(component.hasOnClick(button28)).to.equal(true)
      })

      it('should return false if component does not have an onClick property', function () {
        let button = {hook: 'dummyButton POJO'}

        expect(component.hasOnClick(button)).to.equal(false)
      })
    })
  })
})
