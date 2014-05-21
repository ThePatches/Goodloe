/**
 * Created by Patrick Taylor on 5/19/14.
 */

module.exports = function(inConfig, connection)
{
    var notify = require("./notify.js")(inConfig);
    var schemas = require("./schemas.js");
    var userModel = require("./userModel.js")(inConfig, connection);
    var deckModel = require("./deckModel.js")(connection);

    return {
        notifyModel: notify,
        schemasModel: schemas,
        userModel: userModel,
        deckModel: deckModel,
        CONFIG: inConfig
    };
};