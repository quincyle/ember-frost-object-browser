import config from './config/environment'
import Ember from 'ember'
const {Router: EmberRouter} = Ember

var Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
})

Router.map(function () {
  this.route('overview', {path: '/'})
  this.route('client')
  this.route('client-code')
  this.route('server')
  this.route('server-code')
})

export default Router
