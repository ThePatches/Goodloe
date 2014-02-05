window.App = Ember.Application.create();

App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Router.map(function() {
  this.resource('index', { path: '/' });
  this.resource('addgame', {path: '/addgame'});
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('player');
  }
});
