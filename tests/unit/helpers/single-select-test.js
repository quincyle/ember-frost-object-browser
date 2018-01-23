import {expect} from 'chai'
import SingleSelect from 'ember-frost-object-browser/helpers/single-select'
import {describe, it} from 'mocha'

const singleSelect = SingleSelect.create()

describe('Unit | Helper | single select', function () {
  it('should return false with exactly one item selected', function () {
    let result = singleSelect.compute([[{}], null])
    expect(result).to.equal(false)
  })

  it('should return true with no items selected', function () {
    let result = singleSelect.compute([[], null])
    expect(result).to.equal(true)
  })

  it('should return true with more than one item selected', function () {
    let result = singleSelect.compute([[{}, {}], null])
    expect(result).to.equal(true)
  })
})
