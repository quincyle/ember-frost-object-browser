import Ember from 'ember'
const {A, Controller, Logger, get, inject, isEmpty} = Ember
import computed, {readOnly} from 'ember-computed-decorators'
import {generateFacetView} from 'ember-frost-bunsen/utils'
import {sort} from 'ember-frost-sort'

export default Controller.extend({

  // == Dependencies ==========================================================

  notifications: inject.service('notification-messages'),

  // == Keyword Properties

  queryParams: ['filters', 'sortOrder'],

  // == Properties ============================================================

  filters: {},
  filterModel: {
    type: 'object',
    properties: {
      id: {type: 'string'},
      label: {type: 'string'}
    }
  },
  filterView: generateFacetView([
    {label: 'Id', model: 'id'},
    {label: 'Label', model: 'label'}
  ]),
  itemsPerPage: 10,
  page: 0,
  scrollTop: 0,
  selectedItems: [],
  sortOrder: ['id'],
  sortingProperties: [
    {label: 'Id', value: 'id'},
    {label: 'Label', value: 'label'}
  ],
  totalItems: 100, // Typically extracted from meta on the request

  // == Computed Properties ===================================================

  @readOnly
  @computed('selectedItems.@each.id')
  detailLinkRoutes (selectedItems) {
    return selectedItems.map((selectedItem) => {
      return {
        name: 'user',
        models: [selectedItem.get('id')]
      }
    })
  },

  @readOnly
  @computed('filters', 'model.[]', 'page', 'sortOrder.[]')
  items (filters, model, page, sortOrder) {
    if (isEmpty(model)) {
      return []
    }

    // Client side filtering
    let filteredItems = model
    if (!isEmpty(filters)) {
      filteredItems = model.filter((item) => {
        return A(Object.keys(filters)).every(key => {
          return get(item, key).indexOf(get(filters, key)) >= 0
        })
      })
    }

    // Client side sorting
    const sortedItems = sort(filteredItems, sortOrder)

    // Client side pagination
    const itemsPerPage = this.get('itemsPerPage')
    const pageSliceStart = itemsPerPage * page
    return sortedItems.slice(pageSliceStart, pageSliceStart + itemsPerPage + 1)
  },

  @readOnly
  @computed('selectedItems.@each.label')
  labelIncludesA (selectedItems) {
    return selectedItems.find((selectedItem) => {
      return selectedItem.get('label').toLowerCase().includes('a')
    })
  },

  @readOnly
  @computed('selectedItems.@each.label')
  labelIncludesB (selectedItems) {
    return selectedItems.find((selectedItem) => {
      return selectedItem.get('label').toLowerCase().includes('b')
    })
  },

  @readOnly
  @computed('selectedItems.@each.label')
  labelIncludesF (selectedItems) {
    return selectedItems.find((selectedItem) => {
      return selectedItem.get('label').toLowerCase().includes('f')
    })
  },

  // == Functions =============================================================

  fetchPage (page) {
    this.store.query('list-item', {
      pageSize: this.get('itemsPerPage'),
      start: (page * this.get('itemsPerPage'))
    }).then((response) => {
      this.set('model', this.store.peekAll('list-item'))
    })
  },

  // == Ember Lifecycle Hooks =================================================

  // == Actions ===============================================================

  actions: {
    // BEGIN-SNIPPET client-controller
    onExpansionChange (expandedItems) {
      this.get('expandedItems').setObjects(expandedItems)
    },

    onFilteringChange (filters) {
      this.set('filters', Object.assign({}, filters))
      this.store.unloadAll('list-item')
      this.get('selectedItems').clear()
      this.fetchPage(0)
    },

    onGenericAction (selectedItems, message) {
      this.get('notifications').success(message, {
        autoClear: true,
        clearDuration: 2000
      })
    },

    onPaginationChange (page) {
      this.setProperties({
        page,
        scrollTop: 0
      })
      this.fetchPage(page)
    },

    onSelectionChange (selectedItems) {
      this.get('selectedItems').setObjects(selectedItems)
    },

    onSortingChange (sortOrder) {
      this.get('sortOrder').setObjects(sortOrder)
      this.store.unloadAll('list-item')
      this.get('selectedItems').clear()
      this.fetchPage(0)
    },

    displayFilter () {
      this.get('notifications').success('Display filter section', {
        autoClear: true,
        clearDuration: 2000
      })
    },

    hideFilter () {
      this.get('notifications').success('Hide filter section', {
        autoClear: true,
        clearDuration: 2000
      })
    }
    // END-SNIPPET
  }
})
