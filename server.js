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
var notify = require("./myNodePackages/notify.js");


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
    app.set('port', process.env.PORT || CONFIG.usePort);
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

        var isTrue = CONFIG.useCrypt ? bcrypt.compareSync(password, user.hash) : (password == user.hash);

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
    var DeckModel = null;
    var PlayerModel = null;

    switch (queryData["coll"])
    {
        case "player":
            PlayerModel = connection.model('PlayerModel', SCHEMAS.PlayerSchema, 'Players');

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
            DeckModel = connection.model("DeckModel", SCHEMAS.DeckSchema, "Deck");

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
            break;

        case "game":
            var GameModel = connection.model('Games', SCHEMAS.GameSchema, 'Games');
            DeckModel = connection.model("Deck", SCHEMAS.DeckSchema, 'Deck');
            PlayerModel = connection.model('Players', SCHEMAS.PlayerSchema, 'Players');


            if (queryData["id"])
            {
                findObject._id = queryData["id"];
            }

            GameModel.find(findObject).populate('Players', 'name')
                .populate('players.player').populate('players.deckName')
                .exec(function (err, games)
                {
                    if (err)
                    {
                        console.log("Error" + err);
                    }
                    res.send(games);
                });
            break;

        case "user": // this isn't really useful...

            findObject.username = queryData["name"];
            Users.findOne(findObject, function(err, user)
            {
                if (err) {
                    res.send(500, "Error: " + err);
                }
                if (!user){
                    res.send(500, "No user found!");
                }

                res.send({username: user.username, active: user.active});
            });
            break;

        default:
            res.send("Invalid query type!");
    }
});

app.post('/requser', function(req, res)
{
    var inObject = req.body;
    var findObject = {};

    findObject.username = inObject.username;
    Users.findOne(findObject, function(err, user)
    {
        if (err) {
            res.send(500, "Error: " + err);
        }
        if (user){
            res.send(500, "A user with that name already exists.");
        }
        else // now, we send the email to me...
        {
            var nHash = CONFIG.useCrypt ? bcrypt.hashSync(inObject.password) : inObject.password;
            var msgContent = "Person: " + inObject.person + "\nUsername: " + inObject.username + "\nPassword: " + nHash;
            var params = {
                Message: msgContent,
                Subject: "New User for Goodloe League Requested",
                TopicArn: CONFIG.snsEmails
            }
            if (CONFIG.snsUser.accessKeyId == "")
            {
                res.send(500, "No access key!");
            }
            else {
                notify.sendEmail(params, function (err, data)
                {
                    if (err) res.send(500, err);
                    res.send(data);
                });
            }
        }

    });
});

app.post('/add', auth, function(req, res) // Need to convert these all to post requests
{
    var spaceUrl = req.url.replace(/\s/g,"%2B");
    var queryData = url.parse(spaceUrl, true).query;
    var theItem = null;
    var Player = connection.model('Players', SCHEMAS.PlayerSchema, 'Players');
    var Deck = connection.model('Deck', SCHEMAS.DeckSchema, 'Deck');
    var Game = connection.model('Games', SCHEMAS.GameSchema, 'Games');
    var i = 0;

    console.log(req.body);

    if (queryData["coll"] == "deck")
    {
        theItem = req.body.addedDeck;
        var nDeck = new Deck(theItem);

        nDeck.save(function (err, product, numberAffected)
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
        var aName = req.body.name.replace(/\s/g, "%20");
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
        theItem = req.body.addedGame;
        var nGame = new Game(theItem)
        var playerList = [];
        var winner = null;

        for (i = 0; i < theItem.players.length; i++)
        {
            playerList.push(theItem.players[i].player);
            if (theItem.players[i].winner)
                winner = theItem.players[i].player;
        }

        nGame.save(function (err, product, numberAffected)
        {
           if (err) console.log("Error!");
            else if (numberAffected > 0)
           {
               Player.update({_id: {$in: playerList}}, {$inc: {games: 1}}, {multi: true}, function(err, numberAffected, docs)
               {
                   console.log(docs);
                   if (err) {
                       console.log("Error! " + err);
                       res.send(500);
                   }
                   else
                   {
                       Player.update({_id: winner}, {$inc: {wins: 1}}, {multi: false}, function (err, numberAffected, docs)
                       {
                           if (numberAffected == 1)
                            res.send(product);
                       });

                   }
               });

           }
           else
           {
               console.log("Something went wrong!");
               res.send("Failure!");
           }
        });
    }
    else
        {
        res.send(queryData);
    }
});

app.post('/update', auth, function(req, res)
{
    var spaceUrl = req.url.replace(/\s/g,"%2B"); // TODO: Fix deck updating to work with changes to deck controller
    var queryData = url.parse(spaceUrl, true).query;
    var theItem = {};
    var Player = connection.model('Player', SCHEMAS.PlayerSchema, 'Players');
    var i = 0;

    switch (queryData["coll"])
    {
        case "deck":
            var Deck = connection.model('Deck', SCHEMAS.DeckSchema, 'Deck');
            theItem = req.body.addedDeck;

            console.log(theItem);

            Deck.findOne({_id: theItem._id}, function(err, doc)
            {
                if (err) res.send(err);

                console.log(doc);
                doc.name = theItem.name;
                doc.builder = theItem.builder;
                doc.color = theItem.color;
                doc.save();

                res.send(doc);
            });

            break;

        case "game":
            theItem = req.body.games;
            var Game = connection.model('Games', SCHEMAS.GameSchema, 'Games');

            // Decrement the players involved in the game
            var oldGame = theItem.oldGame;
            var newGame = theItem.newGame;
            var pList = [];
            var winner = null;
            var nPList = [];
            var nWinner = null;

            for (i = 0; i < oldGame.players.length; i++)
            {
                pList.push(oldGame.players[i].player._id);
                if (oldGame.players[i].winner)
                    winner = oldGame.players[i].player._id;
            }

            for (i = 0; i < newGame.players.length; i++)
            {
                nPList.push(newGame.players[i].player);
                if (newGame.players[i].winner)
                    nWinner = newGame.players[i].player;
            }

            console.log(nWinner);

            // Start by rolling back the old changes to players

            Player.update({_id: {$in: pList}}, {$inc: {games: -1}}, {multi: true}, function(err, numberAffected, docs)
            {
                //console.log(docs);
                if (err) {
                    console.log("Error! " + err);
                    res.send(500);
                }
                else
                {
                    Player.update({_id: winner}, {$inc: {wins: -1}}, {multi: false}, function (err, numberAffected, docs)
                    {
                        if (numberAffected == 1) // All changes rolled back, time to change the rest of the game info...
                        {
                            /*var nGame = Game(newGame);
                            nGame._id = oldGame._id;*/
                            Game.findOne({_id: oldGame._id}, function (err, doc)
                            {
                                if (err)
                                {
                                    console.log("Error! " + err);
                                    console.log("Something went wrong!");
                                    res.send("Failure!");
                                }
                                else
                                {
                                    doc.winType = newGame.winType;
                                    doc.story = newGame.story;
                                    doc.description = newGame.description;
                                    doc.players = newGame.players;

                                    doc.save();
                                    var nOutGame = doc;
                                    Player.update({_id: {$in: nPList}}, {$inc: {games: 1}}, {multi: true}, function(err, numberAffected, docs)
                                    {
                                        //console.log(docs);
                                        if (err) {
                                            console.log("Error! " + err);
                                            res.send(500);
                                        }
                                        else
                                        {
                                            Player.update({_id: nWinner}, {$inc: {wins: 1}}, {multi: false}, function (err, numberAffected, docs)
                                            {
                                                if (numberAffected == 1)
                                                {
                                                    //newGame._id
                                                    res.send(nOutGame); // this is a hack, but it should work.
                                                }
                                            });

                                        }
                                    });

                                }
                            });
                        }
                            //res.send(product);
                    });

                }
            });

            break;

        default:
            res.send(queryData);
            break;
    }
});


app.get('/encrypt', auth, function(req, res)
{
    var queryData = req.url;
    queryData = url.parse(queryData, true).query;

    var hash = bcrypt.hashSync(queryData["pass"]);

    res.send(hash);

});

app.post('/login', passport.authenticate('local'), function(req, res)
{
    //console.log(req.user);
    var retUser = req.user;
    res.cookie(CONFIG.cookieName, JSON.stringify({id: retUser._id, username: retUser.username, adminRights: retUser.adminRights, email: retUser.email }));
    res.send(retUser);
});

app.post('/logout', function(req, res)
{
    req.logOut();
    res.clearCookie(CONFIG.cookieName);
    res.send(200);
});

app.get('/maxWins', function(req, res)
{
    var Player = connection.model('Players', SCHEMAS.PlayerSchema, 'Players');
    Player.findOne({}).sort("-wins").exec( function (err, doc)
    {
        if (err) console.log("Error! " + err);
        res.send(doc);
    });
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
        var nHash = addUser.encrypt ? addUser.password : bcrypt.hashSync(addUser.pass);
        console.log(nHash);
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