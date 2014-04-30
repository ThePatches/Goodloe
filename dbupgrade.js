/**
 * Created by Patrick Taylor on 4/28/14.
 */

var conn = new Mongo();
var db = conn.getDB("goodloedb");

var newPatches = ["Added Version Tracking from the Database",
    "You can now set commanders independently of deck name.",
    "Moved messaging from notification service to email service"];

db.Version.insert({_id: 1, version: "0.5.1", changes: newPatches, published: false});