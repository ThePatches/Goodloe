/**
 * Created by Patrick Taylor on 5/19/14.
 */


module.exports = function(CONFIG, connection)
{
    var bcrypt = require('bcrypt-nodejs');
    var SCHEMAS = require("./schemas.js");
    var Users = connection.model("Users", SCHEMAS.UserSchema, "GoodUsers");

    return {
        addUser: function(userCookie, addUser, callback)
        {
            var uCookie = JSON.parse(userCookie);
            if (uCookie.adminRights != 3)
            {
                console.log("admin rights failed!");
                callback("Admin failure!");
            }
            else
            {

                var nHash = addUser.encrypt ? addUser.password : bcrypt.hashSync(addUser.pass);
                var nUser = new Users({username: addUser.username, hash: nHash, active: true, adminRights: addUser.adminRights});

                nUser.save(function (err, product, numberAffected)
                {
                    {
                        if (err)
                        {
                            console.log("Something doesn't work!");
                            callback("Error creating user!");
                        }

                        if (numberAffected > 0)
                        {
                            callback(null, "User Saved!");
                        }
                    }
                });
            }
        },

        userlist: function(callback)
        {
            Users.find({}, 'username email wantemail active adminRights', function(err, users)
            {
                if (err)
                {
                    callback(err, null);
                }
                else
                {
                    callback(null, users);
                }
            });
        },

        updateUser: function(req, cookie, callback)
        {
            var theItem = req.body.inUser;
            console.log(theItem);
            var currUser = JSON.parse(cookie);
            if (currUser.adminRights != 3 && currUser.id != theItem.id)
            {
                callback({code: 401, msg: "You cannot make changes to this user!"});
            }
            else
            {
                Users.findOne({_id: theItem.id}, function (err, doc)
                {
                    if (err){
                        callback(err, null);
                    }
                    else
                    {
                        //console.log(doc);
                        doc.email = theItem.email;
                        doc.wantemail = theItem.wantemail;

                        // More options can appear here

                        doc.save();
                        callback(null, doc);
                    }
                });
            }

        }
    };
};

/*app.post('/adduser', auth, function(req, res)
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
});*/