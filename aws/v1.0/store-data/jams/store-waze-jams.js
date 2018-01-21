const mysql = require('mysql');

//create RDS Aurora MySQL's connection object
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event));
    const events = JSON.parse(JSON.stringify(event));
    console.log(events);
    let jams = JSON.parse(events.Records[0].Sns.Message);
    console.log(jams);
    connection.connect(function (err) {
        if (err) throw err;
        console.log('Connected Id:- ' + connection.threadId);
    });

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
        connection.query(jamQuery, jamVal, function (err, result) {
            if (err) throw err;
            console.log('Waze Alerts stored with UUID: ' + jam.uuid);
            connection.end();
        });
    });


};

