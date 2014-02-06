App.Game = DS.Model.extend({
	//players: DS.hasMany('Player_Deck'),
	players: DS.attr('string'),
	winner: DS.attr('string')
});

App.Player_Deck = DS.Model.extend({
	player: DS.attr('string'),
	deck: DS.attr('string'),
	Game: DS.belongsTo('Game')
});

