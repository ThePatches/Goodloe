var http = require('http');
var https = require('https');
var express = require('express');
var url = require('url');
var CONFIG = require('./config/development.json'); // You must change this to match the actual name of your configuration file.
var SCHEMAS = require('./myNodePackages/schemas.js');
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
passport = require("passport");
LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');

var app = express();

/*var privateKey  = fs.readFileSync('sslcert/ssl.key', 'utf8');
var certificate = fs.readFileSync('sslcert/ssl.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate, passphrase: CONFIG.sslpass};*/
var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);

//console.log(process.env.PORT);
app.configure(function (){
    app.use(express.cookieParser());
    app.use(express.static(__dirname + '/public'));
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'SECRET' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.set('port', process.env.PORT || 1337);
});

//var connection = mongoose.createConnection(CONFIG.connString);
var connection = mongoose.createConnection("mongodb://" + CONFIG.user + ":" + CONFIG.password + "@" + CONFIG.server + "/" + CONFIG.db);
//console.log("mongodb://" + CONFIG.user + ":" + CONFIG.password + "@" + CONFIG.server + "/" + CONFIG.db);
connection.once('open', function ()
{
	console.log('opened database');
});


var Users = connection.model("Users", SCHEMAS.UserSchema, "GoodUsers");

passport.use(new LocalStrategy(function(username, password, done)
{
    Users.findOne({username: username}, function(err, user)
    {
        if (err) {return done(err);}
        if (!user || user.active == false){
            return done(null, false, {message: "Incorrect user name"});
        }

        var isTrue = bcrypt.compareSync(password, user.hash);
        //var isTrue = (password == user.hash);

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
    {
        res.clearCookie(CONFIG.cookieName);
        res.send(401);
    }
    else
        next();

}; //- See more at: https://vickev.com/#!/article/authentication-in-single-page-applications-node-js-passportjs-angularjs

app.get('/query', function(req, res)
{
    var spaceUrl = req.url.replace(/\s/g,"%2B");
    var queryData = url.parse(spaceUrl, true).query;
    var findObject = {};

    console.log(queryData["coll"]);


    switch (queryData["coll"])
    {
        case "player":
            var PlayerModel = connection.model('PlayerModel', SCHEMAS.PlayerSchema, 'Players');

            if (queryData["id"])
            {
                findObject._id = queryData["id"];
            }

            findObject.active = true;
            PlayerModel.find(findObject, function(err, player)
            {
                if (err)
                {
                    console.log("Error " + err);
                }
                res.send(player);
            });
            break;

        case "deck":
            var DeckModel = connection.model("DeckModel", SCHEMAS.DeckSchema, "Deck");

            if (queryData["id"])
            {
                findObject._id = queryData["id"];
            }

            DeckModel.find(findObject, function(err, deck){
                if (err)
                {
                    console.log("Error" + err);
                }
                //console.log("decks");
                res.send(deck);
            });
            break;

        case "game":
            var GameModel = connection.model('GameModel', SCHEMAS.GameSchema, 'Games');

            console.log("In game portion");

            if (queryData["id"])
            {
                findObject._id = queryData["id"];
            }
            GameModel.find(findObject, function(err, game)
            {
                if (err)
                {
                    console.log("Error " + err);
                }
                console.log(game);
                res.send(game);
            });
            break;

        default:
            res.send("Invalid query type!");
    }
});

app.all('/add', auth, function(req, res) // Need to convert these all to post requests
{
    var spaceUrl = req.url.replace(/\s/g,"%2B");
    var queryData = url.parse(spaceUrl, true).query;
    var theItem = null;

    console.log(req.body);

    if (queryData["coll"] == "Deck")
    {
        var Deck = connection.model('DeckModel', SCHEMAS.DeckSchema, 'Deck');
        theItem = JSON.parse(queryData["item"]);
        var ndeck = new Deck(theItem);

        ndeck.save(function (err, product, numberAffected)
        {
           if (err) console.log("Error!");
           else if (numberAffected > 0)
                res.send(product);
            else {
              console.log("Something went wrong!");
              res.send("Failure!");
           }
        });
    }
    else if (queryData["coll"] == "player")
    {
        var Player = connection.model('PlayerModel', SCHEMAS.PlayerSchema, 'Players');
        var aName = req.body.name.replace(/\s/g, "%20");
        console.log(aName);
        theItem = {name: aName, games: 0, active: true, wins: 0};
        var nPlayer = new Player(theItem);

        nPlayer.save(function (err, product, numberAffected)
        {
            if (err) console.log("Error!");
            else if (numberAffected > 0)
            {
                console.log(product);
                res.send(product);
            }
            else {
                console.log("Something went wrong!");
                res.send("Failure!");
            }
        });
    }
    else if (queryData["coll"] == "game")
    {
        var Game = connection.model('GameModel', SCHEMAS.GameSchema, 'Games');
        theItem = req.body.addedGame;
        console.log("The Item: " + theItem);
        var nGame = new Game(theItem);

        nGame.save(function (err, product, numberAffected)
        {
           if (err) console.log("Error!");
            else if (numberAffected > 0)
           {
               console.log(product);
               res.send(product);
           }
           else
           {
               console.log("Something went wrong!");
               res.send("Faulure!");
           }
        });
    }
    else
        {
        res.send(queryData);
    }
});

app.get('/update', auth, function(req, res)
{
    var spaceUrl = req.url.replace(/\s/g,"%2B");
    var queryData = url.parse(spaceUrl, true).query;

    if (queryData["coll"] == "Deck")
    {
        var Deck = connection.model('DeckModel', SCHEMAS.DeckSchema, 'Deck');
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

app.post('/posttest', function(req, res)
{
    console.log(req.body);
    var anItem = req.body.someItem;

    console.log(anItem);
    res.send("Everything went right.")
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
    res.cookie(CONFIG.cookieName, JSON.stringify({id: retUser._id, username: retUser.username, adminRights: retUser.adminRights }));
    res.send(retUser);
});

app.post('/logout', function(req, res)
{
    req.logOut();
    res.clearCookie(CONFIG.cookieName);
    res.send(200);
});

app.post('/adduser', auth, function(req, res)
{
    var uCookie = JSON.parse(req.cookies[CONFIG.cookieName]);
    var addUser = req.body.addUser;

    console.log(addUser);

    if (uCookie.adminRights != 3)
    {
        console.log("admin rights failed");
        res.send(401);
    }
    else
    {
        var nHash = bcrypt.hashSync(addUser.pass);
        var nUser = new Users({username: addUser.username, hash: nHash, active: true, adminRights: addUser.adminRights});

        nUser.save(function (err, product, numberAffected)
        {
            {
                if (err)
                {
                    console.log("Something doesn't work!");
                    res.send(500);
                }

                if (numberAffected > 0)
                {
                    res.send("User Created");
                }
            }
        });
    }
});


app.get('*', function(req, res)
{
    res.sendfile('./public/index.html');
});

httpServer.listen(app.get('port'));
console.log("Listening on port: " + app.get('port'));