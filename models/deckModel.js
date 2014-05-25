/**
 * Created by Patrick Taylor on 5/20/14.
 */

module.exports = function(connection)
{
    var SCHEMAS = require('./schemas.js');
    var DeckModel = connection.model("DeckModel", SCHEMAS.DeckSchema, "Deck");

    return {
        simpleGet: function(findObject, callback)
        {
            DeckModel.find(findObject, function(err, deck){
                if (err)
                {
                   callback(err, null);
                }

                callback(null, deck);
            });
        },

        advancedGet: function(findObject, fields, callback)
        {
            DeckModel.find(findObject, fields, function(err, deck){
                if (err)
                {
                    callback(err, null);
                }

                callback(null, deck);
            });
        },

        simpleAdd: function(theItem, callback)
        {
            var nDeck = new DeckModel(theItem);

            nDeck.save(function (err, product, numberAffected)
            {
                if (err) console.log("Error!");
                else if (numberAffected > 0)
                    callback(null, product);
                else {
                    console.log("Something went wrong!");
                    callback("Failure!", null);
                }
            });
        },

        simpleUpdate: function(theItem, callback)
        {
            //var Deck = connection.model('Deck', SCHEMAS.DeckSchema, 'Deck');
            //theItem = req.body.addedDeck;

            DeckModel.findOne({_id: theItem._id}, function(err, doc)
            {
                if (err) callback(err, null);

                console.log(doc);
                doc.name = theItem.name;
                doc.builder = theItem.builder;
                doc.color = theItem.color;
                doc.commander = theItem.commander;
                doc.deckList = theItem.deckList;
                doc.save();

                callback(null, doc);
            });
        }
    };
};