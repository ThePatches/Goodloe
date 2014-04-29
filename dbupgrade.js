/**
 * Created by Patrick Taylor on 4/28/14.
 */

var conn = new Mongo();
var db = conn.getDB("goodloedb");

var patchNote = {_id: 1, version: "0.5.1", changes: ["Applied DB Upgrading Script",
    "Added changelog page"], published: false};

db.Version.insert(patchNote); // The version in my database at home is better