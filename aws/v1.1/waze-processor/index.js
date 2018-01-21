const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const sqs = new AWS.SQS();

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
            let wazeData = data.Body.toString('utf-8');
            const wazeDataObj = JSON.parse(wazeData);
            const alerts = wazeDataObj.alerts;
            const jams = wazeDataObj.jams;
            if (alerts !== null && alerts !== undefined) {
                const alertsParams = {
                    MessageBody: JSON.stringify(alerts),
                    QueueUrl: process.env.ALERTSQUEUE
                };
                sqs.sendMessage(alertsParams, function (err, data) {
                    if (err) {
                        console.log(err, err.stack);
                    } else {
                        if (jams !== null && jams !== undefined) {
                            publishJamsToQueue(jams);
                        }
                    }
                });
            } else {
                if (jams !== null && jams !== undefined) {
                    publishJamsToQueue(jams);
                }
            }
        }
    });
    function publishJamsToQueue(jams) {
        const jamParams = {
            MessageBody: JSON.stringify(jams),
            QueueUrl: process.env.JAMSQUEUE
        };
        sqs.sendMessage(jamParams, function (err, data) {
            if (err) console.log(err, err.stack);
            else console.log(data);
        });
    }
};

