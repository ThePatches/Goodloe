/**
 * Created by Patrick Taylor on 5/20/14.
 */

module.exports = function(notifier)
{
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

    return {
        suggest: suggestFeature
    };
};