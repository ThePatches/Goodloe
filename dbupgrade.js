/**
 * Created by Patrick Taylor on 4/28/14.
 */

var conn = new Mongo();
var db = conn.getDB("goodloedb");

db.Version.insert({_id: 1, version: "0.5.1", patches: ["This is a test patch for db upgrading"], published: false});