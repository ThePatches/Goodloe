/**
 * Created by Patrick Taylor on 4/28/14.
 */

//var conn = new Mongo();
//var db = conn.getDB("goodloedb");

var newPatches = ["Moved to Express4", "Reworked the server to make more sense", "Added Select2 on the Game Page for deck selection",
    "Reworked the layout of the Game page", "Added a filter for the Deck list", "Made the player percentage display sane", "Fixed user profile saving bug"];

db.Version.insert({_id: 6, version: "1.0.1", changes: newPatches, published: false});
