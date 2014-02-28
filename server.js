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

console.log(process.env.PORT);
app.configure(function (){
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'SECRET' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.set('port', process.env.PORT || 1337);
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
		active: Boolean,
        wins: Number
	});

var DeckSchema = new Schema({
    name: String,
    color: String,
    builder: String
});

var GameSchema = new Schema({
    players: [{playerName: String, deckName: String, winner: Boolean}], // Should probably use ids? I can't decide how I want this to work
    playedOn: Date,
    winType: String,
    gameType: String
});

var UserSchema = new Schema({
   username: String,
   hash: String,
   active: Boolean,
   adminRights: Number
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

        //var hash = bcrypt.hashSync(password);
        var isTrue = bcrypt.compareSync(password, user.hash);
        console.log(isTrue);
        if (isTrue) // maybe needs to be more involved (convert the password into the challenge
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

var auth = function(req, res, next)
{
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();

}; //- See more at: https://vickev.com/#!/article/authentication-in-single-page-applications-node-js-passportjs-angularjs

app.get('/query', function(req, res)
{
    var spaceUrl = req.url.replace(/\s/g,"%2B");
    var queryData = url.parse(spaceUrl, true).query;
    var findObject = {};

    if (queryData["coll"] == "player")
    {
        var PlayerModel = connection.model('PlayerModel', PlayerSchema, 'Players');

        if (queryData["id"])
        {
            findObject._id = queryData["id"];
        }

        PlayerModel.find(findObject, function(err, players)
        {
            if (err)
            {
                console.log("Error " + err);
            }
            res.send(players);
        });

    }
    else if (queryData["coll"] == "deck")
    {
        var DeckModel = connection.model("DeckModel", DeckSchema, "Deck");
        //var findObject = {};

        if (queryData["id"])
        {
            findObject._id = queryData["id"];
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

app.get('/add', auth, function(req, res)
{
    var spaceUrl = req.url.replace(/\s/g,"%2B");
    var queryData = url.parse(spaceUrl, true).query;

    if (queryData["coll"] == "Deck")
    {
        var Deck = connection.model('DeckModel', DeckSchema, 'Deck');
        var theItem = JSON.parse(queryData["item"]);
        var ndeck = new Deck(theItem);

        ndeck.save(function (err, product, numberAffected)
        {
           if (err) console.log("Error!");
           else if (numberAffected > 0)
                res.send(product);
        });
    }
    else {
        res.send(queryData);
    }
});

app.get('/update', auth, function(req, res)
{
    var spaceUrl = req.url.replace(/\s/g,"%2B");
    var queryData = url.parse(spaceUrl, true).query;

    if (queryData["coll"] == "Deck")
    {
        var Deck = connection.model('DeckModel', DeckSchema, 'Deck');
        var theItem = JSON.parse(queryData["item"]);
        console.log(theItem.name);

       Deck.findOne({_id: theItem._id}, function(err, doc)
       {
           if (err) res.send(err);

           console.log(doc);
           doc.name = theItem.name;
           doc.builder = theItem.builder;
           doc.color = theItem.color;
           doc.save();
       });

       res.send(doc);
    }
    else {
        res.send(queryData);
    }
});

app.get('/encrypt', auth, function(req, res)
{
    var queryData = req.url;
    queryData = url.parse(queryData, true).query;

    var hash = bcrypt.hashSync(queryData["pass"]);

    res.send(hash);

    //res.send("Something not quite right?");

});

app.post('/login', passport.authenticate('local'), function(req, res)
{
    var retUser = req.user;
    res.cookie(CONFIG.cookieName, JSON.stringify({id: retUser._id, username: retUser.username }));
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

app.listen(app.get('port'));
console.log("Listening on port: " + app.get('port'));