/**
 * Created by Patrick Taylor on 5/20/14.
 */

var url = require('url');

module.exports = function(userModel)
{
    console.log(userModel);
    function ulist(req, res)
    {
        userModel.userlist(function(err, list)
        {
           if (err)
           {
               res.send(500, err);
           }
           else
           {
               res.send(list);
           }
        });
    }

    function findUser(req, res)
    {
        var spaceUrl = req.url.replace(/\s/g,"%2B");
        var queryData = url.parse(spaceUrl, true).query;
        userModel.findUser(queryData["name"], function(err, user)
        {
           if (err)
           {
               res.send(err);
           } else {
               res.send(user);
           }
        });
    }

    function login(req, res)
    {
        var retUser = req.user;
        res.cookie(CONFIG.cookieName, JSON.stringify({id: retUser._id, username: retUser.username, adminRights: retUser.adminRights, email: retUser.email, wantemail: retUser.wantemail }));
        res.send(retUser);
    }

    return {
        ulist : ulist,
        findUser: findUser
    };
};