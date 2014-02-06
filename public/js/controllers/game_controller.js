/**
 * Created by Patrick Taylor on 2/6/14.
 */

App.GamelistController = Ember.ArrayController.extend({
    actions: {
        createGame: function () {
            var winner = this.get('newWinner');
            if (!winner.trim()) { return; }

            var game = this.store.createRecord('game',
                {
                    winner: winner,
                    players: "one, two, three"
                });

            this.set('newWinner', '');
            game.save();
        }
    }
});