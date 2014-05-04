/**
 * Created by Patrick Taylor on 4/28/14.
 */

//var conn = new Mongo();
//var db = conn.getDB("goodloedb");

var newPatches = ["You can now add a list of cards to a deck"];

db.Version.insert({_id: 3, version: "0.6.2", changes: newPatches, published: false});
