/**
 * Created by Patrick Taylor on 4/28/14.
 */

var conn = new Mongo();
var db = conn.getDB("goodloedb");

var newPatches = ["Added card banning functionality", "Added TypeKit and did some prettifying of the interface", "Decks can be deactivated."];

db.Version.insert({_id: 8, version: "1.2.0", changes: newPatches, published: false});

db.Deck.update({}, {$set: {isActive: true}}, {multi: true});
db.GoodUsers.update({name: "Chris"}, {$set: {adminRights: 2}}, {multi: false});