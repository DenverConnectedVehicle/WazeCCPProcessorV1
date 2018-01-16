//var azure = require('azure');
//var fs = require('fs');
var storage = require('azure-storage');

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    var accessKey = process.env["wazeBlobAccessKey"];
    var storageAccount =  process.env["wazedata"];
    var container = process.env["waze-container"];
    var blob = req.body;
    var blobSvc = storage.createBlobService(storageAccount, accessKey);

    var alertsData = [];
    var jamsData = [];

    blobSvc.getBlobToText(container, blob,  function(err, blobContent, blob) {
        if (!err) {
             var blobData = JSON.parse(blobContent);
             context.log(blobData.alerts.length);
             context.log(blobData.jams.length);
             alertsData = blobData.alerts;
             jamsData = blobData.jams;
        }
    });
    setTimeout(function(){
        var respData = {
                    "alerts":alertsData,
                    "jams":jamsData
                }
            context.res = {
                    body: respData
            };
            context.done();
   }, 3000);
    
};