import Ember from 'ember'
const {Helper, isArray} = Ember

// TODO Better repo location?
export function multiSelect ([selectedItems]) {
  return isArray(selectedItems) && selectedItems.length === 0
}
export default Helper.extend({
  destroy () {
    if (this.teardown) this.teardown()
    this._super(...arguments)
  },
  setupRecompute (selectedItems, property) {
    if (this.teardown) this.teardown()
    var path = '@each.id'
    selectedItems.addObserver(path, this, this.recompute)
    this.teardown = () => {
      selectedItems.removeObserver(path, this, this.recompute)
    }
  },
  compute ([selectedItems, property]) {
    this.setupRecompute(selectedItems, property)
    return isArray(selectedItems) && selectedItems.length === 0
  }
})
