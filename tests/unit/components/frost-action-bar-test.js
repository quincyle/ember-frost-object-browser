import {expect} from 'chai'
import {unit} from 'ember-test-utils/test-support/setup-component-test'
import {beforeEach, describe, it} from 'mocha'

const test = unit('frost-action-bar')

describe(test.label, function () {
  test.setup()

  let component, button212, button28, onClick, disabled, isVisible

  beforeEach(function () {
    onClick = function () { return 'it was clicked' }

    disabled = function () { return false }

    isVisible = function () { return true }

    component = this.subject({
      hook: 'test-action-bar',
      selectedItems: []
    })

    button212 = {
      name: 'frost-button',
      args: {
        named: {
          keys: ['hook', 'text', 'isVisible', 'disabled', 'onClick'],
          _map: {
            disabled: {compute: function () { return disabled }},
            hook: {inner: 'testHook'},
            isVisible: {compute: function () { return isVisible }, _lastValue: true},
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
        isVisible: {_compute: function () { return isVisible }},
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
          classNames: 'disabled',
          disabled: disabled,
          hook: 'testHook',
          isVisible: true,
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

    describe('controlIsVisible', function () {
      it('should return true when isVisible is set to true', function () {
        expect(component.controlIsVisible(button212)).to.equal(true)
      })
    })
  })

  describe('ember 2.8', function () {
    describe('convertControl', function () {
      it('should convert a control to a POJO', function () {
        expect(component.convertControl(button28)).to.eql({
          classNames: 'disabled',
          disabled: disabled,
          hook: 'testHook',
          isVisible: isVisible,
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

    describe('controlIsVisible', function () {
      it('should return true when isVisible is set to true', function () {
        expect(component.controlIsVisible(button212)).to.equal(true)
      })
    })
  })
})
