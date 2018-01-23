import {expect} from 'chai'
import MultiSelect from 'ember-frost-object-browser/helpers/multi-select'
import {describe, it} from 'mocha'

const multiSelect = MultiSelect.create()

describe('Unit | Helper | multi select', function () {
  it('should return true if no items are selected', function () {
    let result = multiSelect.compute([[], null])
    expect(result).to.equal(true)
  })

  it('should return false if items are selected', function () {
    let result = multiSelect.compute([[{}], null])
    expect(result).to.equal(false)
  })
})
