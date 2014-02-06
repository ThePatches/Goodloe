App.Game = DS.Model.extend({
	//players: DS.hasMany('Player_Deck'),
    winner: DS.attr('string'),
    players: DS.attr('string')
});

App.Player_Deck = DS.Model.extend({
	player: DS.attr('string'),
	deck: DS.attr('string'),
	Game: DS.belongsTo('Game')
});

App.Game.FIXTURES =
    [
        {
            id: 1,
            winner: "Patrick",
            players: "Chris, Tyler, Patrick"
        },
        {
            id: 2,
            winner: "Chris",
            players: "Patrick, Chris, Tyler"
        }
    ];
