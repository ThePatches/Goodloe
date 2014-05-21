/**
 * Created by Patrick Taylor on 5/20/14.
 */

var bcrypt = require('bcrypt-nodejs');
passport = require("passport");
LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var url = require('url');

module.exports = function(userModel, CONFIG)
{
    passport.serializeUser(function(user, done){
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done)
    {
        userModel.RawUser.findById(id, function(err,user){
            if(err) done(err);
            done(null,user);
        });
    });

    passport.use(new LocalStrategy(function(username, password, done)
    {
        userModel.RawUser.findOne({username: username}, function(err, user)
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

    function auth(req, res, next)
    {
        if (!req.isAuthenticated())
        {
            res.clearCookie(CONFIG.cookieName);
            res.send(401);
        }
        else
            next();

    } //- See more at: https://vickev.com/#!/article/authentication-in-single-page-applications-node-js-passportjs-angularjs

    function specAuth(req, res, next)
    {
        var uCookie = JSON.parse(req.cookies[CONFIG.cookieName]);
        if (req.isAuthenticated() && uCookie.adminRights == 3)
        {
            next();
        }
        else
            res.send(401, "Viewing the User List Requires Admin Rights!");
    }

    function encrypt(req, res)
    {
        var queryData = req.url;
        queryData = url.parse(queryData, true).query;

        var hash = bcrypt.hashSync(queryData["pass"]);

        res.send(hash);
    }

    return {
        isAuthenticated: auth,
        specialAuth: specAuth,
        encrypt: encrypt
    };
};

