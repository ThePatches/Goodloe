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

                callback(null, deck)
            });
        }
    }
};