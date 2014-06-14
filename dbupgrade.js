/**
 * Created by Patrick Taylor on 4/28/14.
 */

//var conn = new Mongo();
//var db = conn.getDB("goodloedb");

var newPatches = ["Cleaned up some backend code"];

db.Version.insert({_id: 6, version: "1.0.2", changes: newPatches, published: false});
