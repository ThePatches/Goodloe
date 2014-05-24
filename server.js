var http = require('http');
var https = require('https');
var express = require('express');
var url = require('url');
var CONFIG = require('./config/development.json'); // You must change this to match the actual name of your configuration file.
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
passport = require("passport");
LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var serveStatic = require("serve-static");
var router = require('./controllers/router.js');

var app = express();

/*var privateKey  = fs.readFileSync('sslcert/ssl.key', 'utf8');
var certificate = fs.readFileSync('sslcert/ssl.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate, passphrase: CONFIG.sslpass};*/
var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);

//console.log(process.env.PORT);
app.use(cookieParser());
app.use(serveStatic(__dirname + '/public'));
app.use(bodyParser());
app.use(session({ secret: 'SECRET' }));
app.use(passport.initialize());
app.use(passport.session());
app.set('port', process.env.PORT || CONFIG.usePort);

var connection = mongoose.createConnection("mongodb://" + CONFIG.user + ":" + CONFIG.password + "@" + CONFIG.server + "/" + CONFIG.db);
connection.once('open', function ()
{
	console.log('opened database');
});

var models = require("./models/index")(CONFIG, connection);
var SCHEMAS = models.schemasModel;
var notify = models.notifyModel;
var userModel = models.userModel;

router(app, models);

var Users = connection.model("Users", SCHEMAS.UserSchema, "GoodUsers");
var Version = connection.model("Version", SCHEMAS.VersionSchema, "Version");

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
    done(null, user._id);
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

// need to refactor a tools model before I can get this to work right...
app.get('/patches', function(req, res)
{
    Version.find({}).sort("-_id").exec(function(err, patches)
    {
        if (err)
        {
            console.log("Error! " + err);
            res.send(500, err);
        }
        else
            res.send(patches);
    });
});


app.get('/query', function(req, res)
{
    var spaceUrl = req.url.replace(/\s/g,"%2B");
    var queryData = url.parse(spaceUrl, true).query;
    var findObject = {};

    switch (queryData["coll"])
    {
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

app.post('/update', auth, function(req, res)
{
    var spaceUrl = req.url.replace(/\s/g,"%2B");
    var queryData = url.parse(spaceUrl, true).query;
    var theItem = {};
    var Player = connection.model('Player', SCHEMAS.PlayerSchema, 'Players');
    var i = 0;

    switch (queryData["coll"])
    {
        case "user":
            userModel.updateUser(req, req.cookies[CONFIG.cookieName], function(err, doc)
            {
                if (err)
                {
                    if (err.code == 401)
                        res.send(401, err.msg);
                    else
                        res.send(err);
                }
                else
                    res.send(doc);
            });

            break;

            break;

        default:
            res.send(queryData);
            break;
    }
});

app.get('*', function(req, res)
{
    res.sendfile('./public/index.html');
});

Version.findOne({}).sort("-_id").exec(function(err, member)
{
    if (member.published == false) // broadcast stuff goes here
    {
        member.published = true;
        member.save();
    }
   app.set('version', member.version);
   httpServer.listen(app.get('port'));
   console.log("Listening on port: " + app.get('port'));
});
