var http = require('http');
var express = require('express');
var url = require('url');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var app = express();
//var db = mongoose.connect('mongodb://localhost/goodloedb');
//var db = mongoose.connect('mongodb://localhost/mydb');
app.use(express.static(__dirname + '/public'));
app.use(express.bodyParser());
app.use(app.router);

var connection = mongoose.createConnection('mongodb://localhost/goodloedb');
connection.once('open', function ()
{
	console.log('opened database');
});

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

        PlayerModel = connection.model('PlayerModel', PlayerSchema, 'Players');
        //PlayerModel.findOne({active: true}, function (err, player)
        //testModel = connection.model('testModel', testSchema, 'testData');
        PlayerModel.find({}, function(err, player)
        {
            if (err)
            {
                console.log("Error " + err);
            }
            console.log(player);
        });

        //console.log(Objs);

        //mongoose.connection.close();

        res.send("Done getting stuff from mongo.");
    }
    else if (queryData["coll"] == "deck")
    {
        DeckModel = connection.model("DeckModel", DeckSchema, "Deck");
        DeckModel.find({}, function(err, deck){
           if (err)
           {
               console.log("Error" + err);
           }
           res.send(deck);
        });
    }
	//res.send(Objs);
	//res.send({name: "Patrick", count: 15});
});

app.get('/add', function(req, res)
{
    // ?coll=deck&Name=Horrors&Color=BUG&Builder=Chris%2BM
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

app.listen('1337');
console.log('Listening on port 1337');