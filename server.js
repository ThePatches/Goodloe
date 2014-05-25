var http = require('http');
var https = require('https');
var express = require('express');
var url = require('url');
var CONFIG = require('./config/development.json'); // You must change this to match the actual name of your configuration file.
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
var theServer;

if (CONFIG.isSSL)
{
    var privateKey  = fs.readFileSync('sslcert/ssl.key', 'utf8');
    var certificate = fs.readFileSync('sslcert/ssl.crt', 'utf8');

    var credentials = {key: privateKey, cert: certificate, passphrase: CONFIG.sslpass};
    theServer = https.createServer(credentials, app);
}
else
    theServer =  http.createServer(app);

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

router(app, models);

//var Users = connection.model("Users", SCHEMAS.UserSchema, "GoodUsers");
var Version = connection.model("Version", SCHEMAS.VersionSchema, "Version");

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
   theServer.listen(app.get('port'));
   console.log("Listening on port: " + app.get('port'));
});
