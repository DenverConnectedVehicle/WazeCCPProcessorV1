var azure = require('azure-storage');

module.exports = function (context, req) {
    //context.log(req.body);
     
    var dataTable = process.env["WazeDataTable"];
    var tableKey = process.env["WazeTableKey"];
    var alertsTable = process.env["WazeAlertsTable"];
    
    
    
  //  var jsonDataStr = req.body.ContentType;
   
    
   // var jsonData = JSON.parse(jsonDataStr);
    
   
    context.log('JavaScript HTTP trigger function processed a request.');
    var alertData = [];
    
    var tableService = azure.createTableService(dataTable,tableKey);
    var entGen = azure.TableUtilities.entityGenerator;
    var alerts = req.body.alerts;
    //jsonData.alerts;
    context.log(alerts.length);

    tableService.createTableIfNotExists(alertsTable, function(error, result, response){
            if(!error){
                context.log('table created');
            }
    });

    for (i = 0; i < alerts.length; i++) {
        var alert = alerts[i];
        var currentTimeStamp = new Date();
        var rowKeyValue = alert.pubMillis.toString();
        context.log(rowKeyValue);
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
                alertData.push(alert);
            } else {
                context.log('record exists');
            }
        });

           
}
    setTimeout(function(){
        context.log(alertData.length);

            context.res = {
                    body: alertData
            };
            context.done();
    }, 5000);
};