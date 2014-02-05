App.Player = DS.Model.extend({
	name: DS.attr('string'),
	active: DS.attr('boolean'),
	games: DS.attr('integer'),
});

App.Player.FIXTURES = [
 {
	id: 1,
   name: 'Patrick',
   active: true,
   games: 10
 },
 {
	id: 2,
   name: 'Chris',
   active: true,
   games: 30
 },
 {
	id: 3,
   name: 'Tyler',
   active: true,
   games: 20
 }
];