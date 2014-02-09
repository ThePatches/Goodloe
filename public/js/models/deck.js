/**
 * Created by Patrick Taylor on 2/7/14.
 */
App.Deck = DS.Model.extend({
    name: DS.attr('string'),
    color: DS.attr('string'),
    builder: DS.attr('string')
});