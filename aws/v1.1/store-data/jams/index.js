const mysql = require('mysql');
const AWS = require('aws-sdk');
const sqs = new AWS.SQS();

//create RDS Aurora MySQL's connection pool object
const pool = mysql.createPool({
    connectionLimit: 30,
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

module.exports.wazehandler = (event, context, callback) => {
    const lambda = new AWS.Lambda();
    const sqsParams = {
        QueueUrl: process.env.TRAFFICJAMSQUEUE,
        MessageAttributeNames: ['All'],
        AttributeNames: ['All'],
        WaitTimeSeconds: 2
    };
    sqs.receiveMessage(sqsParams, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            if (data.Messages !== undefined) {
                if (data.Messages) {
                    const messages = data.Messages;
                    let jams = JSON.parse(messages[0].Body);
                    jams.forEach(function (jam) {
                        let endNode = '';
                        let blockingAlertUuid = '';
                        let lineStr = '';
                        let segmentStr = '';
                        jam.line.forEach(function (line) {
                            lineStr = lineStr + line.x + ',' + line.y + ' | '
                        });
                        if (jam.segments !== undefined && jam.segments.length > 0) {
                            jam.segments.forEach(function (segment) {
                                segmentStr = segmentStr + JSON.stringify(segment) + ' | ';
                            });
                        }
                        if ('endNode' in jam) {
                            endNode = jam.endNode;
                        }
                        if ('blockingAlertUuid' in jam) {
                            blockingAlertUuid = jam.endNode;
                        }
                        const jamQuery = 'INSERT INTO jams SET ?';
                        const jamVal = {
                            'uuid': jam.uuid,
                            'pubMillis': jam.pubMillis,
                            'street': jam.street,
                            'city': jam.city,
                            'id': jam.id,
                            'level': jam.level,
                            'line': lineStr,
                            'length': jam.length,
                            'turnType': jam.turnType,
                            'type': jam.type,
                            'endNode': endNode,
                            'blockingAlertUuid': blockingAlertUuid,
                            'roadType': jam.roadType,
                            'delay': jam.delay,
                            'speed': jam.speed,
                            'segments': segmentStr,
                            'country': jam.country
                        };
                        pool.getConnection(function (err, connection) {
                            connection.query(jamQuery, jamVal, function (err, result) {
                                if (err) throw err;
                                console.log('Waze Trafficjams recorded: ' + jam.id);
                                connection.release();
                            });
                        });
                    });
                    const delParams = {
                        QueueUrl: process.env.TRAFFICJAMSQUEUE,
                        ReceiptHandle: messages[0].ReceiptHandle
                    };
                    sqs.deleteMessage(delParams, function (err, data) {
                        if (err) console.log(err, err.stack);
                        else console.log(data);
                    });
                    const lambdaParams = {
                        FunctionName: context.functionName,
                        InvocationType: 'Event',
                        Payload: JSON.stringify(event),
                        Qualifier: context.functionVersion
                    };
                    lambda.invoke(lambdaParams, context.done);
                }
            } else {
                context.succeed('Waze TrafficJams Process:Success');
            }
        }
    });
};
