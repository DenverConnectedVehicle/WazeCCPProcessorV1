var azure = require('azure-storage');

module.exports = function (context, req) {
     var dataTable = process.env["WazeDataTable"];
    var tableKey = process.env["WazeTableKey"];
    var jamsTable = process.env["WazeJamsTable"];
    
    var alertData = req.body.alerts;
    
    var jsonData = JSON.parse(req.body.jam);
    
    context.log('JavaScript HTTP trigger function processed a request.');
    var jamData = [];
    var tableService = azure.createTableService(dataTable,tableKey);
    var entGen = azure.TableUtilities.entityGenerator;
    var jams = jsonData.jams;

    for (i = 0; i < jams.length; i++) {
        var jam = jams[i];
        var currentTimeStamp = new Date();
        var rowKeyValue = jam.pubMillis.toString();
        
        var task = {
            PartitionKey: entGen.String('jams'),
            RowKey : entGen.String(rowKeyValue),
            uuid: entGen.String(jam.uuid),
            pubMillis: entGen.String(jam.pubMillis),
            street: entGen.String(jam.street),
            city: entGen.String(jam.city),
            country: entGen.String(jam.country),
            level: jam.level,
            length: jam.length,
            type1: jam.type,
            subtype: jam.subtype,
            endNode: jam.endNode,
            speed: jam.speed,
            blockingAlertUuid: jam.blockingAlertUuid,
            roadType: jam.roadType,
            delay: jam.delay,
            dueDate: entGen.DateTime(new Date())
        };

        tableService.insertEntity(jamsTable,task, function (error, result, response) {
            if(!error){
                context.log('inserted');
                jamData.push(jam);
            } 
        });
    }
    setTimeout(function(){
            context.res = {
                status: 200,
                body: {
                    "alerts":alertData,
                    "jams":jamData
                }
            };
            context.done();
    }, 3000);
  
};