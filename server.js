var http = require('http');
var express = require('express');
var url = require('url');
var CONFIG = require('./config/development.json'); // You must change this to match the actual name of your configuration file.
var bcrypt = require('bcrypt-nodejs');
passport = require("passport");
LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var app = express();

//app.use(app.router);
app.configure(function (){
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'SECRET' }));
    app.use(passport.initialize());
    app.use(passport.session());
});

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

var UserSchema = new Schema({
   username: String,
   hash: String,
   active: Boolean
});

var Users = connection.model("Users", UserSchema, "GoodUsers");

passport.use(new LocalStrategy(function(username, password, done)
{
    Users.findOne({username: username}, function(err, user)
    {
        if (err) {return done(err);}
        if (!user){
            return done(null, false, {message: "Incorrect user name"});
        }

        if (password == user.hash) // maybe needs to be more involved (convert the password into the challenge
        {
            return done(null, user);
        }

        return done(null, false, {message: "Incorrect password"});
    });
}));

passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done)
{
    Users.findById(id, function(err,user){
        if(err) done(err);
        done(null,user);
    });
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

        ndeck.save(function (err, product, numberAffected)
        {
           if (err) console.log("Error!");
           else if (numberAffected > 0)
                res.send(product);
        });
        //res.send("Deck collection updated");
    }
    else {
        res.send(queryData);
    }
});

app.get('/encrypt', function(req, res)
{
    var queryData = req.url;
    queryData = url.parse(queryData, true).query;

    var hash = bcrypt.hashSync(queryData["pass"]);

    var val1 = bcrypt.compareSync("Patrick", hash); // true
    var val2 = bcrypt.compareSync("veggies", hash); // false

    console.log("val1: " + val1 + ", val2: " + val2);
    var outMessage = val1 == true ? "True" : "False";
    res.send(outMessage);

    //res.send("Something not quite right?");

});

app.post('/login', passport.authenticate('local'), function(req, res)
{
    var retUser = req.user;
    res.cookie(CONFIG.cookieName, {id: retUser._id, username: retUser.username});
    res.send(retUser);
});

app.post('/logout', function(req, res)
{
    req.logOut();
    res.clearCookie(CONFIG.cookieName);
    res.send(200);
});


app.get('*', function(req, res)
{
    res.sendfile('./public/index.html');
});

app.listen('1337');
console.log('Listening on port 1337');