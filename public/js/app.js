window.App = Ember.Application.create({});

//App.ApplicationAdapter = DS.FixtureAdapter.extend();
App.Store = DS.Store.extend({
    revision: 1,
    adapter: DS.FixtureAdapter
});

App.Router.map(function() {
    this.resource('index', { path: '/' });
    this.resource('gamelist', {path: '/gamelist'});
    this.resource('game', {path: '/game/:game_id'})
    this.resource('decks', {path: '/decks'});
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

App.DecksRoute = Ember.Route.extend({
    model: function()
    {
        //return jQuery.getJSON("/query?coll=deck");
        return this.store.find('deck');
    }
});