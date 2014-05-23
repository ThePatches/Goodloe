/**
 * Created by Patrick Taylor on 5/23/14.
 */

module.exports = function(connection)
{
    var SCHEMAS = require("./schemas.js");
    var GameModel = connection.model('Games', SCHEMAS.GameSchema, 'Games');
    var DeckModel = connection.model("Deck", SCHEMAS.DeckSchema, 'Deck');
    var PlayerModel = connection.model('Players', SCHEMAS.PlayerSchema, 'Players');

    function makeListGame(inGame)
    {
        var oGame = {};
        oGame.description = inGame.description;
        oGame.gameType = inGame.gameType;
        oGame.playedOn = inGame.playedOn;
        oGame.timePlayed = inGame.timePlayed;

       for (var i = 0; i < inGame.players.length; i++)
       {
           //console.log(inGame.players[i].player)
           if (inGame.players[i].winner == true)
           {
               oGame.winner = inGame.players[i].player.name;
               break
           }
       }

       return oGame;
    }

    return {
        listGet: function(callback) // This is a trick endpoint designed to prevent the list from loading too much information
        {
            GameModel.find({}, "playedOn gameType description players timePlayed").populate('players.player').sort({playedOn: -1}).exec(function(err, games)
            {
                if (err) callback(err, null);

                //console.log(games);

                var outGames = games.map(makeListGame);
                callback(null, outGames);
            });
        },

        simpleGet: function(findObject, callback) {
            GameModel.find(findObject).populate('Players', 'name')
                .populate('players.player').populate('players.deckName')
                .exec(function (err, games)
                {
                    if (err)
                    {
                        callback(err, null)
                    }
                    callback(null, games);
                });
        }
    };
};