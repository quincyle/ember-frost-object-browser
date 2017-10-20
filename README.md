[ci-img]: https://img.shields.io/travis/ciena-frost/ember-frost-object-browser.svg "CI Build Status"
[ci-url]: https://travis-ci.org/ciena-frost/ember-frost-object-browser

[cov-img]: https://img.shields.io/coveralls/ciena-frost/ember-frost-object-browser.svg "Code Coverage"
[cov-url]: https://coveralls.io/github/ciena-frost/ember-frost-object-browser

[npm-img]: https://img.shields.io/npm/v/ember-frost-object-browser.svg "Version"
[npm-url]: https://www.npmjs.com/package/ember-frost-object-browser

[![Travis][ci-img]][ci-url] [![Coveralls][cov-img]][cov-url] [![NPM][npm-img]][npm-url]

# ember-frost-object-browser

 * [Installation](#installation)
 * [Examples](#examples)
 * [Development](#development)

## Installation
```
ember install ember-frost-object-browser
```

## Examples
### Template:
```handlebars
{{frost-object-browser
  filterVisible=filterVisible
  onFilterVisibleChange=(action (mut filterVisible))
  filters=(component 'frost-bunsen-form'
    autofocus=false
    bunsenModel=filterModel
    bunsenView=filterView
    onChange=(action 'onFilteringChange')
    value=filters
  )
  content=(component 'frost-list'
    item=(component 'list-item')
    itemExpansion=(component 'list-item-expansion')
    items=items
    selectedItems=selectedItems
    onSelectionChange=(action 'onSelectionChange')
    pagination=(component 'frost-list-pagination'
      itemsPerPage=itemsPerPage
      page=page
      total=totalItems
      onChange=(action 'onPaginationChange')
    )
    sorting=(component 'frost-sort'
      sortOrder=sortOrder
      sortingProperties=sortingProperties
      onChange=(action 'onSortingChange')
    )
  )
  controls=(component 'frost-action-bar'
    selectedItems=selectedItems
    controls=(array
      (component 'frost-button'
        disabled=(single-select selectedItems)
        priority='secondary'
        size='medium'
        text='Single-select'
        onClick=(action 'onGenericAction' selectedItems 'Single-select enabled action')
      )
      (component 'frost-button'
        disabled=(multi-select selectedItems)
        priority='secondary'
        size='medium'
        text='Multi-select'
        onClick=(action 'onGenericAction' selectedItems 'Multi-select enabled action')
      )
      (component 'frost-button'
        disabled=(not labelIncludesF)
        priority='secondary'
        size='medium'
        text="Label includes 'f'"
        onClick=(action 'onGenericAction' selectedItems 'Custom enabled action')
      )
      (component 'frost-link'
        priority='primary'
        routeNames=detailLinkRouteNames
        size='medium'
        text='Detail'
      )
    )
  )
}}
```

### Controller:

Your controller can implement the following callbacks:

```javascript
onExpansionChange () {…}
onFilteringChange (filterState) {...} //Optional, used with filters
onPaginationChange (page) {…}
onSelectionChange (selectedItems) {…}
onSortingChange (sortOrder) {…}
```

Check out http://ciena-frost.github.io/ember-frost-object-browser/ for the demo app bundled with this addon to see
an example of using this addon.

## Development
### Setup
```
git clone git@github.com:ciena-frost/ember-frost-object-browser.git
cd ember-frost-object-browser
npm install && bower install
```

### Development Server
A dummy application for development is available under `ember-frost-object-browser/tests/dummy`.
To run the server run `ember server` (or `npm start`) from the root of the repository and
visit the app at http://localhost:4200.

### Testing
Run `npm test` from the root of the project to run linting checks as well as execute the test suite
and output code coverage.
