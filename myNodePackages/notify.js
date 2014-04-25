/**
 * Created by Patrick Taylor on 3/12/14.
 */
var aws = require('aws-sdk');
var CONFIG = require("./../config/development.json"); // You must change this

aws.config.update(CONFIG.snsUser);

exports.text = "Some Text";

exports.sendNotification = function (params, callback) // sendEmail(message_params, callback)
    {
        aws.config.update({region: "us-west-2"});
        var sns = new aws.SNS();

        sns.publish(params, callback);
    };

exports.sendAWSEmail = function(params, callback)
{
    console.log("not implemented!");
    aws.config.update({region: "us-west-2"}); // have to make sure I get this right.
    var ses = new aws.SES();

    ses.sendEmail(params, callback);
};