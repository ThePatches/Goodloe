/**
 * Created by Patrick Taylor on 3/12/14.
 */


module.exports = function(CONFIG)
{
    var aws = require('aws-sdk');

    aws.config.update(CONFIG.snsUser);

    return {

        sendNotification: function (params, callback) // sendEmail(message_params, callback)
            {
                aws.config.update({region: "us-west-2"});
                var sns = new aws.SNS();

                sns.publish(params, callback);
            },

       sendAWSEmail: function(params, callback)
        {
            //console.log("not implemented!");
            aws.config.update({region: "us-west-2"});
            var ses = new aws.SES({apiVersion: '2010-12-01'});
            var from = "noreply@goodloeleague.net";

            ses.sendEmail( {
                Source: from,
                Destination: { ToAddresses: params.toAddress },
                Message: {
                    Subject: {
                    Data: params.Subject
                    },
                Body: {
                Text: {
                    Data: params.Body
                    }
                }
            }
            }, callback);

            //ses.sendEmail(params, callback);
        },

       adminEmail: CONFIG.adminEmail,

       canSend: function()
       {
           return CONFIG.snsUser.accessKeyId != "";
       }
    };
};