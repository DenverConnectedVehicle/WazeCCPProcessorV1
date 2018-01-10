var azure = require('azure-storage');

module.exports = function (context, req) {
    var dataTable = process.env["WazeDataTable"];
    var tableKey = process.env["WazeTableKey"];
    var alertsTable = process.env["WazeAlertsTable"];
    var jsonDataStr = req.body;
    var jsonData = JSON.parse(jsonDataStr);
    context.log('JavaScript HTTP trigger function processed a request.');
    var alertData = [];
    
    var tableService = azure.createTableService(dataTable,tableKey);
    var entGen = azure.TableUtilities.entityGenerator;
    var alerts = jsonData.alerts;
    
    for (i = 0; i < alerts.length; i++) {
        var alert = alerts[i];
        var currentTimeStamp = new Date();
        var rowKeyValue = alert.pubMillis.toString();
        var task = {
            PartitionKey: entGen.String('alerts'),
            RowKey : entGen.String(rowKeyValue),
            uuid: alert.uuid,
            pubMillis: alert.pubMillis,
            latitude: alert.location.y,
            longitude: alert.location.x,
            street: alert.street,
            city: alert.city,
            country: alert.country,
            nThumbsUp: alert.nThumbsUp,
            reportRating: alert.reportRating,
            confidence: alert.confidence,
            magvar: alert.magvar,
            subtype: alert.subtype,
            reliability: alert.reliability,
            reportDescription: alert.reportDescription,
            dueDate: entGen.DateTime(new Date())
        };
        tableService.insertEntity(alertsTable,task, function (error, result, response) {
            if(!error){
                context.log('inserted');
                alertData.push(task);
            } 
        });
}
    setTimeout(function(){
            context.res = {
                    body: alertData
            };
            context.done();
    }, 3000);
};