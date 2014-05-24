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
        oGame._id = inGame._id;

       for (var i = 0; i < inGame.players.length; i++)
       {
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
            GameModel.find({}, "_id playedOn gameType description players timePlayed").populate('players.player').sort({playedOn: -1}).exec(function(err, games)
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
        },

        simpleAdd: function(theItem, callback)
        {
            var nGame = new GameModel(theItem);
            var playerList = [];
            var winner = null, i;

            for (i = 0; i < theItem.players.length; i++)
            {
                playerList.push(theItem.players[i].player);
                if (theItem.players[i].winner)
                    winner = theItem.players[i].player;
            }

            nGame.save(function (err, product, numberAffected)
            {
                if (err) console.log("Error!");
                else if (numberAffected > 0)
                {
                    console.log("Game saved!");
                    if (theItem.gameType != "1v1")
                    {
                        PlayerModel.update({_id: {$in: playerList}}, {$inc: {games: 1}}, {multi: true}, function(err, numberAffected, docs)
                        {
                            console.log(docs);
                            if (err) {
                                callback(err, null);
                            }
                            else
                            {
                                PlayerModel.update({_id: winner}, {$inc: {wins: 1}}, {multi: false}, function (err, numberAffected, docs)
                                {
                                    if (numberAffected == 1)
                                        callback(null, product);
                                });

                            }
                        });
                    }
                    else
                    {
                        console.log("Ignored user changes.");
                        if (numberAffected == 1)
                            callback(null, product);
                    }

                }
                else
                {
                    console.log("Something went wrong during deck adding!");
                    callback("Other error!", null);
                }
            });
        },

        simpleUpdate: function(oldGame, newGame, callback)
        {
            var pList = [];
            var winner = null;
            var nPList = [];
            var nWinner = null, i;

            for (i = 0; i < oldGame.players.length; i++)
            {
                pList.push(oldGame.players[i].player._id);
                if (oldGame.players[i].winner)
                    winner = oldGame.players[i].player._id;
            }

            for (i = 0; i < newGame.players.length; i++)
            {
                nPList.push(newGame.players[i].player);
                if (newGame.players[i].winner)
                    nWinner = newGame.players[i].player;
            }

            console.log(nWinner);

            // Start by rolling back the old changes to players

            PlayerModel.update({_id: {$in: pList}}, {$inc: {games: -1}}, {multi: true}, function(err, numberAffected, docs)
            {
                //console.log(docs);
                if (err) {
                    callback(err, null);
                }
                else
                {
                    PlayerModel.update({_id: winner}, {$inc: {wins: -1}}, {multi: false}, function (err, numberAffected)
                    {
                        if (numberAffected == 1) // All changes rolled back, time to change the rest of the game info...
                        {
                            GameModel.findOne({_id: oldGame._id}, function (err, doc)
                            {
                                if (err)
                                {
                                    console.log("Error! " + err);
                                    console.log("Something went wrong!");
                                    callback("Failure!", null);
                                }
                                else
                                {
                                    console.log(newGame.timePlayed);
                                    doc.winType = newGame.winType;
                                    doc.story = newGame.story;
                                    doc.description = newGame.description;
                                    doc.players = newGame.players;
                                    doc.timePlayed = newGame.timePlayed;

                                    doc.save();
                                    var nOutGame = doc;
                                    PlayerModel.update({_id: {$in: nPList}}, {$inc: {games: 1}}, {multi: true}, function(err)
                                    {
                                        if (err) {
                                            callback(err, null);
                                        }
                                        else
                                        {
                                            PlayerModel.update({_id: nWinner}, {$inc: {wins: 1}}, {multi: false}, function (err, numberAffected, docs)
                                            {
                                                if (numberAffected == 1)
                                                {
                                                    callback(null, nOutGame);
                                                }
                                            });

                                        }
                                    });

                                }
                            });
                        }
                    });

                }
            });
        }
    };
};