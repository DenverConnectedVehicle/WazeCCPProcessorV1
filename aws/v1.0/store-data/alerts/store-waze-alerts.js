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
    const events  = JSON.parse(JSON.stringify(event));
    console.log(events);
    let alerts = JSON.parse(events.Records[0].Sns.Message);
    console.log(alerts);
    connection.connect(function (err) {
        if (err) throw err;
        console.log('Connected Id:- ' + connection.threadId);
    });
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


        connection.query(alertsQuery, alertsVal, function (err, result) {
            if (err) throw err;
            console.log('Waze Alerts stored with UUID: ' + alert.uuid);
            connection.end();
        });
    });
};

