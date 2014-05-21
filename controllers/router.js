/**
 * Created by Patrick Taylor on 5/20/14.
 */

passport = require("passport");
LocalStrategy = require('passport-local').Strategy;

module.exports = function(app, models)
{
    //console.log(models.userModel);
    var userController = require('./userController')(models.userModel);
    var auth = require("./auth")(models.userModel, models.CONFIG);

    app.get('/ulist', auth.specialAuth, userController.ulist);
    app.get('/finduser', userController.findUser);
    app.post('/adduser', auth.specialAuth, userController.addUser);

    app.get('/version', function(req, res)
    {
        res.send(app.get('version'));
    });


    // This is inelegant but it works

    app.post('/login', passport.authenticate('local'), function(req, res)
    {
        var retUser = req.user;
        res.cookie(models.CONFIG.cookieName, JSON.stringify({id: retUser._id, username: retUser.username, adminRights: retUser.adminRights, email: retUser.email, wantemail: retUser.wantemail }));
        res.send(retUser);
    });

    app.get('/logout', function(req, res)
    {
        req.logOut();
        res.clearCookie(models.CONFIG.cookieName);
        res.send(200);
    });
};