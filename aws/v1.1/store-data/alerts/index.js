const mysql = require('mysql');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

//create RDS Aurora MySQL's connection pool object
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

module.exports.wazehandler = (event, context, callback) => {
    const lambda = new AWS.Lambda();
    const params = {
        QueueUrl: process.env.ALERTSQUEUE,
        MessageAttributeNames: ['All'],
        AttributeNames: ['All'],
        WaitTimeSeconds: 2
    };
    sqs.receiveMessage(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            if (data.Messages !== undefined) {
                if (data.Messages) {
                    const messages = data.Messages;
                    let alerts = JSON.parse(messages[0].Body);
                    alerts.forEach(function (alert) {
                        let reportDescription;
                        if ("reportDescription" in alert) {
                            reportDescription = alert.reportDescription;
                        } else {
                            reportDescription = '';
                        }
                        const alertsQuery = 'INSERT INTO alerts SET ?';
                        const alertsVal = {
                            'uuid': alert.uuid,
                            'pubMillis': alert.pubMillis,
                            'latitude': alert.location.y,
                            'longitude': alert.location.x,
                            'street': alert.street,
                            'city': alert.city,
                            'country': alert.country,
                            'type': alert.type,
                            'nThumbsUp': alert.nThumbsUp,
                            'reportRating': alert.reportRating,
                            'confidence': alert.confidence,
                            'magvar': alert.magvar,
                            'subtype': alert.subtype,
                            'reliability': alert.reliability,
                            'reportDescription': reportDescription
                        };
                        pool.getConnection(function (err, connection) {
                            connection.query(alertsQuery, alertsVal, function (err, result) {
                                if (err) throw err;
                                console.log('Waze Alerts Inserted: ' + alert.uuid);
                                connection.release();
                            });
                        });
                    });
                    const delParams = {
                        QueueUrl: process.env.ALERTSQUEUE,
                        ReceiptHandle: messages[0].ReceiptHandle
                    };
                    sqs.deleteMessage(delParams, function (err, data) {
                        if (err) console.log(err, err.stack);
                        else console.log(data);
                    });
                    const params = {
                        FunctionName: context.functionName,
                        InvocationType: 'Event',
                        Payload: JSON.stringify(event),
                        Qualifier: context.functionVersion
                    };
                    lambda.invoke(params, context.done);
                }
            } else {
                context.succeed('Waze alerts Prcess:Success');
            }
        }
    });
};
