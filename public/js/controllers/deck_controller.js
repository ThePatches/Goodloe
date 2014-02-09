/**
 * Created by Patrick Taylor on 2/8/14.
 */

App.DecksController = Ember.ArrayController.extend({
    actions: {
        createDeck: function () {
            var name = this.get('newName');
            if (!name.trim()) { return; }

            var color = this.get('newColor');
            if (!color.trim()) { return; }

            var builder = this.get('newBuilder');
            if (!builder.trim()) {return; }

            var deck = this.store.createRecord('deck',
                {
                    name: name,
                    color: color,
                    builder: builder

                });

            this.set('newName', '');
            this.set('newColor', '');
            this.set('newBuilder');
            deck.save();
        }
    }
});