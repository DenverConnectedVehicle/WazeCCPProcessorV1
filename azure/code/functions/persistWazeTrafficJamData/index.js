var azure = require('azure-storage');
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    
    var dataTable = process.env["WazeDataTable"];
    var tableKey = process.env["WazeTableKey"];
    var jamsTable = process.env["WazeJamsTable"];

    var jamData = [];
    var tableService = azure.createTableService(dataTable,tableKey);
    var entGen = azure.TableUtilities.entityGenerator;
    var jams = req.body.jams;

    tableService.createTableIfNotExists(jamsTable, function(error, result, response){
            if(!error){
                context.log('table created');
            }
    });

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
            }  else {
                context.log('record exists');
            }
        });
    }
    setTimeout(function(){
        context.log(jamData.length);
             context.res = {
                    body: jamData
            };
            context.done();
    }, 3000);
};