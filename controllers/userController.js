/**
 * Created by Patrick Taylor on 5/20/14.
 */

var url = require('url');

module.exports = function(userModel, CONFIG)
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
        userModel.findUser(queryData.name, function(err, user)
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
        var addedUser = req.body.addUser;
        userModel.addUser(uCookie, addedUser, function(err, msg)
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

    function updateUser(req, res)
    {
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
    }

    return {
        ulist : ulist,
        findUser: findUser,
        addUser: addUser,
        updateUser: updateUser
    };
};