/**
 * Created by Patrick Taylor on 5/20/14.
 */

var bcrypt = require("bcrypt-nodejs");

module.exports = function(models)
{
    var notifier = models.notifyModel;
    var userModel = models.userModel;
    var CONFIG = models.CONFIG;

    //console.log(notifier);
    function suggestFeature(req, res)
    {
        console.log("req.body " + JSON.stringify(req.body));

        var inObject = req.body;

        var msgContent = "Suggestion: " + inObject.title + "\nDescription: " + inObject.suggestion + "\n\nEmail: " + inObject.email;
        var params = {
            Body: msgContent,
            Subject: "Goodloe League Suggestion Box",
            toAddress: [notifier.adminEmail]
        };

        if (!notifier.canSend())
        {
            console.log("CanSendFailed!");
            res.send(500, "No access key!");
        }
        else {
            notifier.sendAWSEmail(params, function (err, data)
            {
                if (err) res.send(500, err);
                res.send(data);
            });
        }
    }

    function reqUser(req, res)
    {
        var inObject = req.body;
        var findObject = {};

        findObject.username = inObject.username;
        userModel.RawUser.findOne(findObject, function(err, user)
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
                    Body: msgContent,
                    Subject: "New User for Goodloe League Requested",
                    toAddress: [CONFIG.adminEmail]
                };
                if (!notifier.canSend())
                {
                    res.send(500, "No access key!");
                }
                else {
                    notifier.sendAWSEmail(params, function (err, data)
                    {
                        if (err) res.send(500, err);
                        res.send(data);
                    });
                }
            }

        });
    }

    return {
        suggest: suggestFeature,
        requestUser: reqUser
    };
};