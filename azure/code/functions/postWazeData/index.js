var Client = require('node-rest-client').Client;
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
     context.done();
};