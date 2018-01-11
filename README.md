[ci-img]: https://img.shields.io/travis/ciena-frost/ember-frost-object-browser.svg "CI Build Status"
[ci-url]: https://travis-ci.org/ciena-frost/ember-frost-object-browser

[cov-img]: https://img.shields.io/coveralls/ciena-frost/ember-frost-object-browser.svg "Code Coverage"
[cov-url]: https://coveralls.io/github/ciena-frost/ember-frost-object-browser

[npm-img]: https://img.shields.io/npm/v/ember-frost-object-browser.svg "Version"
[npm-url]: https://www.npmjs.com/package/ember-frost-object-browser

[![Travis][ci-img]][ci-url] [![Coveralls][cov-img]][cov-url] [![NPM][npm-img]][npm-url]

# ember-frost-object-browser

 * [Installation](#installation)
 * [API](#api)
 * [Examples](#examples)
 * [Demo](#demo)
 * [Development](#development)

## Installation
```
ember install ember-frost-object-browser
```

## API

### Action Bar

| Attribute       | Type                                           | Value         | Description                                                 |
| --------------- | ---------------------------------------------- | ------------- | ----------------------------------------------------------- |
| controls        | `Ember.Component[]`                            |               | Controls that will be available in the action bar           |
| isLoading       | `boolean`                                      | false         | **default** - Action bar is not in a loading state          |
|                 |                                                | true          | Action bar is in a loading state                            |
| alwaysVisible   | `boolean`                                      | false         | **default** action bar shows when selectedItems has length  |
|                 |                                                | true          | action bar will always be visible                           |
| loadingText     | `string`                                       |               | Text that appears beside the loading animation              |
| moreActions     | `Ember.Component[]\|boolean\|object[]\|object` | true          | **default** - Auto-aggregate buttons for moreActions button |
|                 |                                                | false         | No More... button, controls used as passed                  |
|                 |                                                | array\|object | Components or hash defining actions for moreActions button  |
| moreActionsText | `string`                                       | 'More...'     | **default** Text for 'More...' button                       |
| selectedItems   | `Ember.Component[]\|object[]`                  |               | List of items that are currently selected                   |

## Examples

### Object Browser

#### Template

```handlebars
{{frost-object-browser
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
        routes=detailLinkRoutes
        size='medium'
        text='Detail'
      )
    )
  )
}}
```

#### Controller:

Your controller can implement the following callbacks:

```javascript
onExpansionChange () {…}
onFilteringChange (filterState) {...} //Optional, used with filters
onPaginationChange (page) {…}
onSelectionChange (selectedItems) {…}
onSortingChange (sortOrder) {…}
```

### Action Bar

#### Template Examples

```handlebars
{{! default moreActions behavior }}
{{frost-action-bar
  controls=(array
    (component 'frost-link'
      priority='primary'
      routes=detailLinkRoutes
      size='medium'
      text='Detail'
    )
    (component 'frost-button'
      text='Extra button one'
      hook='extraButtonOne'
      onClick=(action 'doTheFirstExtraThing')
    )
    (component 'frost-button'
      text='Extra button two'
      hook='extraButtonTwo'
      onClick=(action 'doTheSecondExtraThing')
    )
    (component 'frost-button'
      text='Extra button Three'
      hook='extraButtonThree'
      onClick=(action 'doTheThirdExtraThing')
    )
    (component 'frost-button'
      text='Extra button four'
      hook='extraButtonFour'
      onClick=(action 'doTheFourthExtraThing')
    )
    (component 'frost-button'
      text='Extra button five'
      hook='extraButtonFive'
      onClick=(action 'doTheFifthExtraThing')
    )
  )
  isLoading=isLoading
  loadingText='Loading actions'
  selectedItems=selectedItems
}}
```
```handlebars
{{! override default moreActions behavior }}
{{frost-action-bar
  controls=(array
    (component 'frost-link'
      priority='primary'
      routes=detailLinkRoutes
      size='medium'
      text='Detail'
    )
    (component 'frost-button'
      text='Extra button one'
      hook='extraButtonOne'
      onClick=(action 'doTheFirstExtraThing')
    )
    (component 'frost-button'
      text='Extra button two'
      hook='extraButtonTwo'
      onClick=(action 'doTheSecondExtraThing')
    )
    (component 'frost-button'
      text='Extra button Three'
      hook='extraButtonThree'
      onClick=(action 'doTheSecondExtraThing')
    )
    (component 'frost-button'
      text='Extra button four'
      hook='extraButtonFour'
      onClick=(action 'doTheSecondExtraThing')
    )
    (component 'frost-button'
      text='Extra button five'
      hook='extraButtonFive'
      onClick=(action 'doTheSecondExtraThing')
    )
  )
  moreActions=false
  isLoading=isLoading
  loadingText='Loading actions'
  selectedItems=selectedItems
}}
```
```handlebars
{{! manual moreActions }}
{{frost-action-bar
  controls=(array
    (component 'frost-link'
      priority='primary'
      routes=detailLinkRoutes
      size='medium'
      text='Detail'
    )
  )
  moreActions=(array
    (component 'frost-button'
      text='Extra button one'
      hook='extraButtonOne'
      onClick=(action 'doTheFirstExtraThing')
    )
    (component 'frost-button'
      text='Extra button two'
      hook='extraButtonTwo'
      onClick=(action 'doTheSecondExtraThing')
    )
  )
  isLoading=isLoading
  loadingText='Loading actions'
  selectedItems=selectedItems
}}
```

A scenario where the loading state in the action bar might be useful is if there is some amount of processing that needs to be done in order to determine the state of the controls within the action bar. For example, determining whether a button should be enabled/disabled or shown/hidden. Note that the loading animation is the ring type from [ember-frost-core](https://github.com/ciena-frost/ember-frost-core).

#### More... Button

By default, if the action bar has more than 4 visible components, only the last 4 will be shown. The rest will be collapsed into a "More..." button with a popover list of the remaining actions. Only components with an `onClick` property will be automatically collapsed. This can be overridden by setting `moreActions=false` or by manually setting the action buttons you want wrapped up. The `moreActions` property accepts either components with an `onClick` property or `POJO`s that define `hook`, `text`, `onClick`, and optionally `disabled` and `isVisible`.

##### POJO example

```javascript
...
moreActions: {
  button1: {
    hook: 'button1',
    text: 'button 1',
    onClick: function () { // do something }
  },
  button2: {
    hook: 'button2',
    text: 'button 2',
    onClick: function () { // do something }
  }
}
...
```
```handlebars
{{frost-action-bar
  controls=(array
    (component 'frost-link'
      priority='primary'
      routes=detailLinkRoutes
      size='medium'
      text='Detail'
    )
  )
  moreActions=moreActions
  isLoading=isLoading
  loadingText='Loading actions'
  selectedItems=selectedItems
}}
```

## Demo

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
