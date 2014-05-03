/**
 * Created by Patrick Taylor on 4/28/14.
 */

var newPatches = ["Player Updating feature added",
    "Fixed issues with + signs within the database",
    "Beginnings of 'Goodloe Rules' page"];

db.Version.insert({_id: 2, version: "0.6.1", patches: newPatches, published: false});