module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    var d = new Date();
    context.log(d);
    context.res = {
        body: d
    };
   
    context.done();
};