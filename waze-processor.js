const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const sns = new AWS.SNS();

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event));
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    console.log('Bucket: ' + bucket);
    console.log('Key: ' + key);
    s3.getObject(params, (err, data) => {
        if (err) {
            const message = `Error getting object ${key} from bucket ${bucket}. Reason:` + err;
            console.log(message);
            callback(message);
        } else {
            let wazeDataObj = data.Body.toString('utf-8');
            const pWazeDataObj = JSON.parse(wazeDataObj);
            const alerts = pWazeDataObj.alerts;
            const jams = pWazeDataObj.jams;
            if (wazeDataObj !== null && wazeDataObj !== undefined) {
                console.log(alerts);
                const alertsParams = {
                    Message: JSON.stringify(alerts),
                    TopicArn: process.env.ALERTSTOPIC
                };
                sns.publish(alertsParams, function (err, data) {
                    if (err) {
                        console.log(err, err.stack);
                    }
                    else {
                        console.log('--------------------');
                        console.log(data);
                        if (jams !== undefined && jams !== null) {
                            const jamParams = {
                                Message: JSON.stringify(jams),
                                TopicArn: process.env.JAMSTOPIC
                            };
                            sns.publish(jamParams, function (err, data) {
                                if (err) console.log(err, err.stack);
                                else console.log(data);
                            });

                        }
                    }
                });
            }
        }
    });
};

