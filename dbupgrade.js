/**
 * Created by Patrick Taylor on 4/28/14.
 */

//var conn = new Mongo();
//var db = conn.getDB("goodloedb");

var newPatches = ["Fixed an issue preventing players from updating their own profiles."];

db.Version.insert({_id: 4, version: "0.6.3", changes: newPatches, published: false});
