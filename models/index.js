/**
 * Created by Patrick Taylor on 5/19/14.
 */

module.exports = function(inConfig, connection)
{
    var notify = require("./notify.js")(inConfig);
    var schemas = require("./schemas.js");
    var userModel = require("./userModel.js")(inConfig, connection);
    var deckModel = require("./deckModel.js")(connection);
    var playerModel = require('./playerModel.js')(connection);
    var gameModel = require('./gameModel.js')(connection);
    var rulesModel = require('./rulesModel')(connection);

    return {
        notifyModel: notify,
        schemasModel: schemas,
        userModel: userModel,
        deckModel: deckModel,
        playerModel: playerModel,
        gameModel: gameModel,
        rulesModel: rulesModel,
        CONFIG: inConfig
    };
};