/**
 * Created by Patrick Taylor on 2/7/14.
 */
App.Deck = DS.Model.extend({
    name: DS.attr('string'),
    color: DS.attr('string'),
    builder: DS.attr('string')
});

App.Deck.FIXTURES = [
    {
        id: 1,
        name: "Garza Zol",
        color: "UBR",
        builder: "Tyler M"
    },
    {
        id: 2,
        name: "Daxos",
        color: "UW",
        builder: "Chris M"
    }

];