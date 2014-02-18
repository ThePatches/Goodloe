var http = require('http');
var express = require('express');
var url = require('url');
var CONFIG = require('./config/development.json'); // You must change this to match the actual name of your configuration file.

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var app = express();

//app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());

//var connection = mongoose.createConnection(CONFIG.connString);
var connection = mongoose.createConnection("mongodb://" + CONFIG.user + ":" + CONFIG.password + "@" + CONFIG.server + "/" + CONFIG.db);
console.log("mongodb://" + CONFIG.user + ":" + CONFIG.password + "@" + CONFIG.server + "/" + CONFIG.db);
connection.once('open', function ()
{
	console.log('opened database');
});

// Schemas I should probably put these in their own folder at some point...
var PlayerSchema = new Schema({
		name: String,
		games: Number,
		active: Boolean
	});

var DeckSchema = new Schema({
    name: String,
    color: String,
    builder: String
});

app.get('/query', function(req, res)
{
    var spaceUrl = req.url.replace(/\s/g,"%2B");
    var queryData = url.parse(spaceUrl, true).query;

    if (queryData["coll"] == "player")
    {

        var PlayerModel = connection.model('PlayerModel', PlayerSchema, 'Players');
        PlayerModel.find({}, function(err, player)
        {
            if (err)
            {
                console.log("Error " + err);
            }
            res.send(player);
        });

    }
    else if (queryData["coll"] == "deck")
    {
        var DeckModel = connection.model("DeckModel", DeckSchema, "Deck");
        var findObject = {};

        if (queryData["id"])
        {
            console.log(queryData["id"]);
            findObject._id = queryData["id"];
            //findObject = {_id: "52f450eb4c76094c1f623a26"};
        }

        DeckModel.find(findObject, function(err, deck){
           if (err)
           {
               console.log("Error" + err);
           }
           res.send(deck);
        });
    }
    else
    {
        res.send("Invalid query type!");
    }
});

app.get('/add', function(req, res)
{
    var spaceUrl = req.url.replace(/\s/g,"%2B");
    var queryData = url.parse(spaceUrl, true).query;

    if (queryData["coll"] == "Deck")
    {
        var Deck = connection.model('DeckModel', DeckSchema, 'Deck');
        var ndeck = new Deck({name: queryData["Name"], color: queryData["Color"], builder: queryData["Builder"]});

        ndeck.save(function (err)
        {
           if (err) console.log("Error!");
        });
        res.send("Deck collection updated");
    }
    else {
        res.send(queryData);
    }
});

app.get('*', function(req, res)
{
    res.sendfile('./public/index.html');
});

app.listen('1337');
console.log('Listening on port 1337');