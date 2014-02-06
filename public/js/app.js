window.App = Ember.Application.create({});

App.ApplicationAdapter = DS.FixtureAdapter.extend();

App.Router.map(function() {
    this.resource('index', { path: '/' });
    this.resource('gamelist', {path: '/gamelist'});
    this.resource('game', {path: '/game/:game_id'})
});

App.IndexRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('player');
  }
});

App.GamelistRoute = Ember.Route.extend({
	model: function ()
	{
		return this.store.find('game');
	}
});

App.GameRoute = Ember.Route.extend({
   model: function(params)
   {
       return this.store.find('game', params.game_id);
   }
});