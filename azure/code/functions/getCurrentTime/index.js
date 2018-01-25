module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    var d = new Date();
    context.log(d);
    context.res = {
        // status: 200, /* Defaults to 200 */
        body: d
    };
   
    context.done();
};