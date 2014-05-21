/**
 * Created by Patrick Taylor on 5/20/14.
 */

var url = require('url');

module.exports = function(userModel)
{
    //console.log(userModel);
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

    function addUser(req, res)
    {
        var uCookie = req.cookies;
        var addUser = req.body.addUser;
        userModel.addUser(uCookie, addUser, function(err, msg)
        {
           if (err)
           {
               if (err.statusCode == 401){
                   res.send(err);
               } else {
                   res.send(500, err);
               }
           } else {
               res.send(msg);
           }
        });
    }

    return {
        ulist : ulist,
        findUser: findUser,
        addUser: addUser
    };
};