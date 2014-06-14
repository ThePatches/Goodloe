/**
 * Created by Patrick Taylor on 4/28/14.
 */

//var conn = new Mongo();
//var db = conn.getDB("goodloedb");

var newPatches = ["Allow decks to be retired when they change commanders."];

db.Version.insert({_id: 8, version: "1.1.1", changes: newPatches, published: false});

db.Deck.update({}, {$set: {isActive: true}}, {multi: true});
db.GoodUsers.update({name: "Chris"}, {$set: {adminRights: 2}}, {multi: false});