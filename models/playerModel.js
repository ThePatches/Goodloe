/**
 * Created by Patrick Taylor on 5/21/14.
 */

module.exports = function(connection)
{
    var SCHEMAS = require('./schemas.js');
    var PlayerModel = connection.model('PlayerModel', SCHEMAS.PlayerSchema, 'Players');

    return{
        simpleGet: function(findObject, callback)
        {
            findObject.active = true;
            PlayerModel.find(findObject, function(err, player)
            {
                if (err)
                {
                    callback(err, null);
                } else {
                    callback(null, player);
                }
            });
        },

        advancedGet: function(findObject, fields, callback)
        {
            PlayerModel.find(findObject, fields, function(err, player)
            {
                if (err)
                {
                    callback(err, null);
                } else {
                    callback(null, player);
                }
            });
        },

        simpleAdd: function(theItem, callback)
        {
            var nPlayer = new PlayerModel(theItem);

            nPlayer.save(function (err, product, numberAffected)
            {
                if (err) callback(err, null);
                else if (numberAffected > 0)
                {
                    callback(null, product);
                }
                else {
                    console.log("Something went wrong!");
                    callback("Failure!", null);
                }
            });
        },

        simpleUpdate: function(theItem, callback)
        {
            PlayerModel.findOne({_id: theItem._id}, function(err, doc)
            {
                if (err)
                {
                    callback(err, null);
                }
                else
                {
                    doc.name = theItem.name;
                    doc.save();
                    callback(null, doc);
                }
            });
        }
    }
};