/**
 * Created by Patrick Taylor on 4/28/14.
 */

//var conn = new Mongo();
//var db = conn.getDB("goodloedb");

var newPatches = ["Added a User List for me", "Fixed an issue with updating decks when there was no list provided."];

db.Version.insert({_id: 5, version: "0.6.4", changes: newPatches, published: false});
